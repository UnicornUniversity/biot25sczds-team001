const express             = require("express");
const router              = express.Router();
const gatewayDao          = require("../dao/gatewayDao");
const authenticateToken   = require("../middleware/authTokenValidation");
const validate            = require("../middleware/validate");
const Joi                 = require("joi");
const deviceDao           = require("../dao/deviceDao");  

// --- Validation schemas ---
const updateGatewaySchema = Joi.object({
  name:        Joi.string(),
  description: Joi.string().allow(null, ""),
  buildingId:  Joi.string().allow(null),
  created:     Joi.boolean(),
}).min(1);

// 1) Templates endpoint (must come *before* /:id)
router.get(
  "/gateways/templates",
  authenticateToken,
  async (req, res) => {
    try {
      const ownerId = req.user.id;
      const { itemList } = await gatewayDao.list({ ownerId, created: false });
      res.json({ message: "Gateway templates fetched", data: itemList });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// 2) Available-gateways endpoint (also before /:id)
router.get(
  "/gateways/available-gateways",
  authenticateToken,
  async (req, res) => {
    try {
      const ownerId = req.user.id;
      const available = await gatewayDao.getAvailableGateways(ownerId);
      res.json({ message: "Available gateways fetched", data: available });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// 3) List all (possibly filtered) in-app gateways
router.get(
  "/gateways",
  authenticateToken,
  async (req, res) => {
    try {
      const { page = 1, pageSize = 10, ownerId, buildingId, created } = req.query;
      const pageInfo = {
        page:      parseInt(page),
        pageSize:  parseInt(pageSize),
        ownerId,
        buildingId,
        created:   created !== undefined ? created === "true" : undefined,
      };
      const result = await gatewayDao.list(pageInfo);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// 4) GET single by ID
router.get(
  "/gateways/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const gw = await gatewayDao.getById(req.params.id);
      if (!gw) return res.status(404).json({ message: "Gateway not found" });
      res.json(gw);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// 5) Update (flip created, assign buildingId, etc.)
router.put(
  "/gateways/:id",
  authenticateToken,
  validate(updateGatewaySchema),
  async (req, res) => {
    try {
      const updated = await gatewayDao.updateById(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: "Gateway not found" });
      res.json({ message: "Gateway updated", data: updated });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// GET /gateways/:gatewayId/devices
// — stránkované vyhledávání všech devices připojených na konkrétní gateway
router.get(
    "/gateways/:gatewayId/devices",
    authenticateToken,
    async (req, res) => {
      try {
        const ownerId   = req.user.id;
        const gatewayId = req.params.gatewayId;
        // page a pageSize jde vzít z query, default jsou 1 a 10
        const { page = 1, pageSize = 10 } = req.query;
        const pageInfo = {
          page:      parseInt(page),
          pageSize:  parseInt(pageSize),
          ownerId,
          gatewayId,
          created: true
        };
        const result = await require("../dao/deviceDao").list(pageInfo);
        res.json(result);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  );

  router.delete(
    "/gateways/:id",
    authenticateToken,
    async (req, res) => {
      try {
        const id = req.params.id;
        const ownerId = req.user.id;
  
        // 1) ověření existence a vlastníka
        const existing = await gatewayDao.getById(id);
        if (!existing || existing.ownerId !== ownerId) {
          return res.status(404).json({ message: "Gateway not found" });
        }
  
        // 2) odpojení gateway samo o sobě
        const updatedGw = await gatewayDao.updateById(id, {
          created: false,
          buildingId: null,
          updatedAt: new Date(),
        });
  
        // 3) hromadná aktualizace všech devices pod touto gateway
        //    — přepneme created=false, doorId=null
        await deviceDao.updateMany(
          { gatewayId: id, ownerId },
          { $set: { created: false, doorId: null, updatedAt: new Date() } }
        );
  
        res.json({ message: "Gateway detached and devices reset", data: updatedGw });
      } catch (err) {
        console.error("Detach GW error:", err);
        res.status(500).json({ message: err.message });
      }
    }
  );
  

module.exports = router;