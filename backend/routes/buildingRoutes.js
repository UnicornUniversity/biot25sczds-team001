// src/routes/buildings.js

const express           = require("express");
const router            = express.Router();
const buildingDao       = require("../dao/buildingDao");
const gatewayDao        = require("../dao/gatewayDao");
const Device            = require("../models/Device");
const Door              = require("../models/Door");       // ← importujeme model dveří
const auth              = require("../middleware/authTokenValidation");
const validate          = require("../middleware/validate");
const Joi               = require("joi");

// --- Validation schemas ---
const createSchema = Joi.object({
  name:        Joi.string().required(),
  description: Joi.string().allow("", null),
  gatewayId:   Joi.string().optional().allow("", null),
});

const updateSchema = Joi.object({
  name:        Joi.string().optional(),
  description: Joi.string().optional().allow("", null),
  gatewayId:   Joi.string().optional().allow("", null),
}).min(1);

// GET /buildings
// → vrací stránkovaně seznam budov včetně odvozeného statusu
router.get("/buildings", auth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const page     = parseInt(req.query.page, 10)     || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const result   = await buildingDao.list({ page, pageSize, ownerId });

    // pro každou budovu zjistíme, jestli má aspoň jedny dveře v alertu
    const withStatus = await Promise.all(
      result.itemList.map(async b => {
        const alertDoor = await Door.findOne({ buildingId: b._id, state: "alert" });
        return {
          ...b.toObject(),
          status: alertDoor ? "alert" : "safe"
        };
      })
    );

    res.json({
      itemList: withStatus,
      pageInfo: result.pageInfo
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /buildings/:id
// → vrací detail jedné budovy + gatewayId + status
router.get("/buildings/:id", auth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const bldId   = req.params.id;

    // 1) načíst budovu
    const building = await buildingDao.get({ _id: bldId, ownerId });
    if (!building) {
      return res.status(404).json({ message: "Building not found" });
    }

    // 2) najít aktuálně přiřazenou gateway
    const oldGw = await gatewayDao.getByFilter({ ownerId, buildingId: bldId });

    // 3) zjistit status dveří
    const alertDoor = await Door.findOne({ buildingId: bldId, state: "alert" });
    const status = alertDoor ? "alert" : "safe";

    // 4) vrátit budovu + gatewayId + status
    res.json({
      message: "Building fetched",
      data: {
        ...building.toObject(),
        gatewayId: oldGw?._id || null,
        status
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /buildings
router.post(
  "/buildings",
  auth,
  validate(createSchema),
  async (req, res) => {
    try {
      const ownerId    = req.user.id;
      const { name, description, gatewayId } = req.body;

      // 1) vytvořit budovu
      const building = await buildingDao.create({ name, description, ownerId });

      // 2) přiřadit gateway, pokud je
      if (gatewayId) {
        await gatewayDao.updateById(gatewayId, { buildingId: building._id });
      }

      res.status(201).json({ message: "Building created", data: building });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// PUT /buildings/:id
router.put(
  "/buildings/:id",
  auth,
  validate(updateSchema),
  async (req, res) => {
    try {
      const ownerId = req.user.id;
      const bldId   = req.params.id;
      const { name, description, gatewayId } = req.body;

      // 1) ověření vlastnictví
      const existing = await buildingDao.get({ _id: bldId, ownerId });
      if (!existing) {
        return res.status(404).json({ message: "Building not found" });
      }

      // 2) zjistit starou gateway
      const oldGw = await gatewayDao.getByFilter({ ownerId, buildingId: bldId });
      const oldGwId = oldGw?._id;

      // 3) pokud se změnila, odpojit starou a odpojit u ní všechna doorId
      if (gatewayId !== oldGwId) {
        if (oldGwId) {
          await gatewayDao.updateById(oldGwId, { buildingId: null });
          // očistit doorId na všech zařízeních z původní brány
          await Device.updateMany(
            { gatewayId: oldGwId },
            { $set: { doorId: null } }
          );
        }
        if (gatewayId) {
          await gatewayDao.updateById(gatewayId, { buildingId: bldId });
        }
      }

      // 4) aktualizovat data budovy (name/description)
      const updated = await buildingDao.update({ id: bldId, name, description });
      res.json({ message: "Building updated", data: updated });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// DELETE /buildings/:id
router.delete("/buildings/:id", auth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const bldId   = req.params.id;

    // 1) najít budovu + vlastnictví
    const existing = await buildingDao.get({ _id: bldId, ownerId });
    if (!existing) {
      return res.status(404).json({ message: "Building not found" });
    }

    // 2) odpojit případnou gateway a očistit device.doorId
    const oldGw = await gatewayDao.getByFilter({ ownerId, buildingId: bldId });
    if (oldGw?._id) {
      await gatewayDao.updateById(oldGw._id, { buildingId: null });
      await Device.updateMany(
        { gatewayId: oldGw._id },
        { $set: { doorId: null } }
      );
    }

    // 3) smazat budovu
    await buildingDao.delete(bldId);
    res.json({ message: "Building deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;