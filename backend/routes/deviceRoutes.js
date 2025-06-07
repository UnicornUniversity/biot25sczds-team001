const express           = require("express");
const router            = express.Router();
const deviceDao         = require("../dao/deviceDao");
const gatewayDao        = require("../dao/gatewayDao");
const doorDao           = require("../dao/doorDao");
const authenticateToken = require("../middleware/authTokenValidation");
const validate          = require("../middleware/validate");
const Joi               = require("joi");
const { v4: uuidv4 } = require('uuid');

// --- Validation schemas ---
const updateSchema = Joi.object({
  gatewayId:   Joi.string().optional(),
  doorId:      Joi.string().allow(null).optional(),
  name:        Joi.string().optional(),
  description: Joi.string().allow("", null).optional(),
  created:     Joi.boolean().optional(),
}).min(1);

const adminCreateDeviceSchema = Joi.object({
  _id:        Joi.string().required(),
  ownerId:    Joi.string().required(),
  gatewayId:  Joi.string().required(),
  name:       Joi.string().required(),
  adminKey:   Joi.string().required(),
});

// 1) Templates endpoint
router.get(
  "/devices/templates",
  authenticateToken,
  async (req, res) => {
    try {
      const { gatewayId } = req.query;
      const gw = await gatewayDao.getById(gatewayId);
      if (!gw || gw.ownerId !== req.user.id) {
        return res.status(404).json({ message: "Gateway not found or not yours" });
      }
      const templates = await deviceDao.getTemplates(gatewayId);
      res.json({ message: "Controller templates fetched", data: templates });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// 2) Available-controllers endpoint
router.get(
  "/devices/available-controllers",
  authenticateToken,
  async (req, res) => {
    try {
      const { gatewayId } = req.query;
      const result = await deviceDao.getAvailableControllers(req.user.id, gatewayId);
      res.json({ message: "Available controllers fetched", data: result });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// 3) List all controllers
router.get(
  "/devices",
  authenticateToken,
  async (req, res) => {
    try {
      const { page = 1, pageSize = 10, doorId, gatewayId, created } = req.query;
      const pageInfo = {
        page:     parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
        ownerId:  req.user.id,
        doorId,
        gatewayId,
        created:  created !== undefined ? created === "true" : undefined,
      };
      const result = await deviceDao.list(pageInfo);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// 4) GET single by ID
router.get(
  "/devices/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const device = await deviceDao.getById(req.params.id);
      if (!device || device.ownerId !== req.user.id) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.json({ message: "Device fetched", data: device });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// 5) PUT /devices/:id — update, reassign gateway/door, detach
router.put(
  "/devices/:id",
  authenticateToken,
  validate(updateSchema),
  async (req, res) => {
    try {
      const ownerId = req.user.id;
      const id      = req.params.id;
      let { gatewayId, doorId, created, ...rest } = req.body;

      // load existing
      const existing = await deviceDao.getById(id);
      if (!existing || existing.ownerId !== ownerId) {
        return res.status(404).json({ message: "Device not found or not yours" });
      }

      // if the client says "created: false", also clear the doorId
      if (created === false) {
        doorId = null;
      }

      // handle gateway reassignment
      if (gatewayId !== undefined && gatewayId !== existing.gatewayId) {
        const newGw = await gatewayDao.getById(gatewayId);
        if (!newGw || newGw.ownerId !== ownerId) {
          return res.status(404).json({ message: "New gateway not found or not yours" });
        }
      }

      // handle door reassignment (only if doorId truthy)
      if (doorId && doorId !== existing.doorId) {
        const newDoor = await doorDao.get({ _id: doorId });
        if (!newDoor || newDoor.buildingId !== existing.gatewayId) {
          return res.status(404).json({ message: "Door not found or wrong building" });
        }
      }

      // perform update
      const updated = await deviceDao.updateById(
        id,
        { gatewayId, doorId, created, ...rest },
        ownerId
      );
      if (!updated) {
        return res.status(400).json({ message: "Failed to update device" });
      }

      res.json({ message: "Device updated", data: updated });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// POST /devices/admin-create
router.post(
    "/devices/admin-create",
    validate(adminCreateDeviceSchema),
    async (req, res) => {
      try {
        const { _id, ownerId, gatewayId, name, adminKey } = req.body;
        if (adminKey !== process.env.ADMIN_KEY) {
          return res.status(403).json({ message: "Invalid admin key" });
        }

        // Optionally check if gateway exists and belongs to ownerId
        const gateway = await gatewayDao.getById(gatewayId);
        if (!gateway || gateway.ownerId !== ownerId) {
          return res.status(404).json({ message: "Gateway not found or not owned by user" });
        }

        const device = await deviceDao.create({
          _id,
          ownerId,
          gatewayId,
          name,
          created: false,
          description: null,
        });

        res.status(201).json({ message: "Device created", data: device });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
);

module.exports = router;
