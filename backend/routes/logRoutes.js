const express = require("express");
const router  = express.Router();
const logDao  = require("../dao/logDao");
const validate            = require("../middleware/validate");
const authenticateToken   = require("../middleware/authTokenValidation");
const Joi = require("joi");

/* ---------- validation ---------- */
const createLogSchema = Joi.object({
  severity: Joi.string().valid("info", "warning", "error").required(),
  message : Joi.string().required(),
  doorId  : Joi.string().allow(null),
});

/* ---------- GET /logs (admin/list) ---------- */
router.get("/logs", authenticateToken, async (req, res) => {
  try {
    const { page = 1, pageSize = 10, relatedDoor, severity } = req.query;
    const result = await logDao.list({
      page:      parseInt(page, 10),
      pageSize:  parseInt(pageSize, 10),
      relatedDoor,
      severity,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------- POST /log/create ---------- */
router.post("/log/create",
  validate(createLogSchema),
  authenticateToken,
  async (req, res) => {
    try {
      const log = await logDao.create(req.body);

      /* Socket.IO push */
      const io = req.app.get("io");
      io.emit("log:new", log);

      res.status(201).json({ message: "Log created", data: log });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

/* ---------- GET /logs/user ---------- */
router.get("/logs/user", authenticateToken, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { page = 1, pageSize = 10, severity } = req.query;
    const result = await logDao.listByUser({
      ownerId,
      page:      parseInt(page, 10),
      pageSize:  parseInt(pageSize, 10),
      severity,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------- GET /logs/building/:id ---------- */
router.get("/logs/building/:buildingId", authenticateToken, async (req, res) => {
  try {
    const { buildingId } = req.params;
    const { page = 1, pageSize = 10, severity } = req.query;

    const result = await logDao.listByBuilding({
      buildingId,
      page:      parseInt(page, 10),
      pageSize:  parseInt(pageSize, 10),
      severity,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;