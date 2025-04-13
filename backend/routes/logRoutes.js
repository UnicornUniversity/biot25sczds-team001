const express = require("express");
const router = express.Router();
const logDao = require("../dao/logDao");
const validate = require("../middleware/validate");
const Joi = require("joi");

// Validation schemas
const createLogSchema = Joi.object({
    severity: Joi.string().valid("info", "warning", "error").required(),
    message: Joi.string().required(),
    relatedDoor: Joi.string().allow(null),
});

// GET /logs - List all logs
router.get("/logs", async (req, res) => {
    try {
        const {page = 1, pageSize = 10, relatedDoor, severity} = req.query;
        const pageInfo = {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            relatedDoor,
            severity,
        };
        const result = await logDao.list(pageInfo);
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// POST /log/create - Create a new log
router.post("/log/create", validate(createLogSchema), async (req, res) => {
    try {
        const log = await logDao.create(req.body);
        res.status(201).json({
            status: 200,
            message: "Vytvořeno",
            data: log,
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;
