const express   = require("express");
const router    = express.Router();
const doorDao     = require("../dao/doorDao");
const buildingDao = require("../dao/buildingDao");
const deviceDao   = require("../dao/deviceDao");
const validate    = require("../middleware/validate");
const auth        = require("../middleware/authTokenValidation");
const Joi         = require("joi");
const User        = require("../models/User");     
const Door         = require("../models/Door"); 
const Building = require("../models/Building");

// Validation schemas
const createDoorSchema = Joi.object({
    buildingId: Joi.string().required(),
    deviceId:   Joi.string().allow("", null).optional(),
    name:       Joi.string().required(),
    description:Joi.string().allow("", null),
    locked:     Joi.boolean().default(false),
    state:      Joi.string().valid("safe","alert","inactive").default("safe"),
  });
  const updateDoorSchema = Joi.object({
    buildingId: Joi.string().optional(),
    deviceId:   Joi.string().allow("", null).optional(),
    name:        Joi.string().optional(),
    description: Joi.string().allow("", null).optional(),
    locked:      Joi.boolean().optional(),
    state:       Joi.string().valid("safe","alert","inactive").optional(),
  }).min(1);

// zde nahoře po importech přidejte:
const toggleStateSchema = Joi.object({
    state: Joi.string().valid("safe", "alert", "inactive").required(),
  });
  

// routes/api/doorsStatus.js   (or wherever you mounted '/doors/status')
router.get(
    '/doors/status',
    auth,
    async (req, res) => {
      try {
        const ownerId  = req.user.id;
        const page     = parseInt(req.query.page, 10)     || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
  
        // 1) load user's buildings
        const buildings = await Building.find({ ownerId });
        const bIds = buildings.map(b => b._id);
  
        // 2) define alert-only filter
        const filter = {
          buildingId: { $in: bIds },
          state: 'alert'
        };
  
        // 3) count & fetch only alert doors
        const total = await Door.countDocuments(filter);
        const docs  = await Door.find(filter)
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .lean();
  
        // 4) include buildingName
        const buildingMap = buildings.reduce((acc, b) => {
          acc[b._id] = b.name;
          return acc;
        }, {});
  
        const data = docs.map(d => ({
          doorId:       d._id,
          doorName:     d.name,
          state:        d.state,
          buildingId:   d.buildingId,
          buildingName: buildingMap[d.buildingId],
        }));
  
        // 5) pageInfo
        const totalPages = Math.ceil(total / pageSize);
  
        res.json({
          itemList: data,
          pageInfo: { page, pageSize, total, totalPages }
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  );

// routes/api/doors.js  (úsek „GET /doors/favourites“)
router.get('/doors/favourites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const favIds = user.favouriteDoors || [];

    // doors + lean
    const doors = await Door.find({ _id: { $in: favIds } }).lean();

    // fetch building names
    const buildingIds = doors.map(d => d.buildingId);
    const buildings = await Building
      .find({ _id: { $in: buildingIds } })
      .select('name')
      .lean();
    const bMap = Object.fromEntries(buildings.map(b => [b._id.toString(), b.name]));

    // enrich
    const enriched = doors.map(d => ({
      ...d,
      buildingName: bMap[d.buildingId?.toString()] || ''
    }));

    res.json({ message: 'Favourites fetched', data: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get(
    "/buildings/:buildingId/doors",
    auth,
    async (req, res) => {
      try {
        const ownerId  = req.user.id;
        const building = await buildingDao.get({
          _id: req.params.buildingId,
          ownerId,
        });
        if (!building) return res.status(404).json({ message: "Building not found" });
  
        const page     = parseInt(req.query.page, 10)     || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const result   = await doorDao.list({
          page, pageSize, buildingId: req.params.buildingId
        });
  
        // načteme oblíbené dveře uživatele
        const user = await User.findById(ownerId);
        const favs = user ? user.favouriteDoors : [];
  
        res.json({
          itemList:       result.itemList,
          pageInfo:       result.pageInfo,
          favouriteDoors: favs,
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  );

// Create door
router.post(
  "/doors",
  auth,
  validate(createDoorSchema),
  async (req, res) => {
    try {
      const ownerId = req.user.id;
      const { buildingId, deviceId, name, description, locked, state } = req.body;
      const building = await buildingDao.get({ _id: buildingId, ownerId });
      if (!building) return res.status(404).json({ message: "Building not found" });
      // create
      const door = await doorDao.create({ buildingId, name, description, locked, state });
      // attach device
      if (deviceId) {
        await deviceDao.updateById(deviceId, { doorId: door._id }, ownerId);
      }
      res.status(201).json({ message: "Door created", data: door });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Get single door
router.get(
  "/doors/:id",
  auth,
  async (req, res) => {
    try {
      const door = await doorDao.get({ _id: req.params.id });
      if (!door) return res.status(404).json({ message: "Door not found" });
      const ownerId = req.user.id;
      const building = await buildingDao.get({ _id: door.buildingId, ownerId });
      if (!building) return res.status(403).json({ message: "Access denied" });
      // fetch attached device
      let controller = null;
      if (door._id) {
        const ctrlRes = await deviceDao.list({ page:1, pageSize:1, ownerId, doorId: door._id });
        controller = ctrlRes.itemList[0] || null;
      }
      res.json({ message: "Door fetched", data: { door, controller } });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Update door
router.put(
  "/doors/:id",
  auth,
  validate(updateDoorSchema),
  async (req, res) => {
    try {
      const ownerId = req.user.id;
      const doorId = req.params.id;

      // load existing
      const existing = await doorDao.get({ _id: doorId });
      if (!existing) return res.status(404).json({ message: "Door not found" });

      // verify building ownership
      const buildingCheck = await buildingDao.get({ _id: existing.buildingId, ownerId });
      if (!buildingCheck) return res.status(403).json({ message: "Access denied" });

      // if building changed, verify new building
      if (req.body.buildingId && req.body.buildingId !== existing.buildingId) {
        const newB = await buildingDao.get({ _id: req.body.buildingId, ownerId });
        if (!newB) return res.status(404).json({ message: "New building not found" });
      }

      // find old assigned device
      const oldList = await deviceDao.list({ page:1, pageSize:1, ownerId, doorId });
      const oldDeviceId = oldList.itemList.length ? oldList.itemList[0]._id : null;
      const newDeviceId = req.body.deviceId;

      // update door
      const updatedDoor = await doorDao.update({ _id: doorId, ...req.body });

      // detach old device
      if (oldDeviceId && oldDeviceId !== newDeviceId) {
        await deviceDao.updateById(oldDeviceId, { doorId: null }, ownerId);
      }
      // attach new device
      if (newDeviceId && newDeviceId !== oldDeviceId) {
        await deviceDao.updateById(newDeviceId, { doorId }, ownerId);
      }

      res.json({ message: "Door updated", data: updatedDoor });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// ─── DELETE A DOOR ───────────────────────────────────────────
router.delete(
    "/doors/:id",
    auth,
    async (req, res) => {
      try {
        const doorId  = req.params.id;
        const ownerId = req.user.id;
        const door     = await doorDao.get({ _id: doorId });
        if (!door) return res.status(404).json({ message: "Door not found" });
  
        const building = await buildingDao.get({ _id: door.buildingId, ownerId });
        if (!building) return res.status(403).json({ message: "Access denied" });
  
        // odpojení controlleru
        const ctrlList = await deviceDao.list({ page:1, pageSize:1, ownerId, doorId });
        if (ctrlList.itemList.length) {
          await deviceDao.updateById(ctrlList.itemList[0]._id, { doorId: null }, ownerId);
        }
  
        // odstraníme toto doorId z favouriteDoors přihlášeného uživatele
        await User.findByIdAndUpdate(ownerId, {
          $pull: { favouriteDoors: doorId }
        });
  
        await doorDao.delete(doorId);
        res.json({ message: "Door deleted" });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  );


// ─── SET DOOR STATE ────────────────────────────────────────
router.post(
    "/doors/:id/toggle-state",
    auth,
    validate(toggleStateSchema),
    async (req, res) => {
      try {
        const doorId = req.params.id;
        const { state: newState } = req.body;
  
        // ověření existence dveří + vlastníka
        const door = await doorDao.get({ _id: doorId });
        if (!door) return res.status(404).json({ message: "Door not found" });
  
        const ownerId  = req.user.id;
        const building = await buildingDao.get({ _id: door.buildingId, ownerId });
        if (!building) {
          return res.status(403).json({ message: "Access denied" });
        }
  
        // nastavíme nový stav dle požadavku
        const updated = await doorDao.toggleState(doorId, newState);
        /* --- PUSH přes Socket.IO --- */
            const io = req.app.get('io');
            io.emit('door:state', {
              doorId     : updated._id.toString(),
              doorName   : updated.name,
              buildingId : updated.buildingId.toString(),
              state      : updated.state,
              locked     : updated.locked,
              updatedAt  : updated.updatedAt,
            });

        res.json({ message: "State updated", data: updated });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
  );

// ─── TOGGLE LOCK ────────────────────────────────────────────
router.post(
  "/doors/:id/toggle-lock",
  auth,
  async (req, res) => {
    try {
      const door = await doorDao.get({ _id: req.params.id });
      if (!door) return res.status(404).json({ message: "Door not found" });

      const ownerId  = req.user.id;
      const building = await buildingDao.get({ _id: door.buildingId, ownerId });
      if (!building) {
        return res.status(403).json({ message: "Access denied" });
      }

      const toggled = await doorDao.toggleLock(req.params.id);
      res.json({ message: "Lock toggled", data: toggled });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ─── TOGGLE FAVOURITE ────────────────────────────────────────
router.post(
    "/doors/:id/toggle-favourite",
    auth,
    async (req, res) => {
      try {
        const updatedFavs = await doorDao.toggleFavourite(
          req.user.id,
          req.params.id
        );
        res.json({ message: "Favourite toggled", data: updatedFavs });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  );

// ─── FETCH DOOR LOGS ────────────────────────────────────────
router.get(
  "/doors/:id/logs",
  auth,
  async (req, res) => {
    try {
      const door = await doorDao.get({ _id: req.params.id });
      if (!door) return res.status(404).json({ message: "Door not found" });

      const ownerId  = req.user.id;
      const building = await buildingDao.get({ _id: door.buildingId, ownerId });
      if (!building) {
        return res.status(403).json({ message: "Access denied" });
      }

      const limit  = parseInt(req.query.limit, 10)  || 10;
      const offset = parseInt(req.query.offset, 10) || 0;
      const logs   = await doorDao.getLogs(req.params.id, limit, offset);
      res.json({ message: "Logs fetched", data: logs });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
