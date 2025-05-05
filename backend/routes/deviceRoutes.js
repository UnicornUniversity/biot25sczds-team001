const express = require("express");
const router = express.Router();
const iotNodeDao = require("../dao/deviceDao");
const validate = require("../middleware/validate");
const authenticateToken = require("../middleware/authTokenValidation");
const Joi = require("joi");

// Validation schemas
const createDeviceSchema = Joi.object({
    doorId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow("").default(""),
});

const updateDeviceSchema = Joi.object({
    id: Joi.string().required(),
    doorId: Joi.string(),
    name: Joi.string(),
    description: Joi.string().allow(""),
}).min(2); // At least id and one field to update

const deleteDeviceSchema = Joi.object({
    id: Joi.string().required(),
});

// TODO: update based on FE needs
// GET /device - List all IoT devices
router.get("/device", authenticateToken, async (req, res) => {
    try {
        const {page = 1, pageSize = 10, doorId} = req.query;
        const pageInfo = {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            doorId,
        };
        const result = await iotNodeDao.list(pageInfo);
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// POST /device/create - Create a new IoT device (System profile only)
router.post("/device/create", validate(createDeviceSchema), authenticateToken, async (req, res) => {
    try {
        const device = await iotNodeDao.create(req.body);
        res.status(201).json({
            status: 200,
            message: "Vytvořeno",
            data: device,
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// PUT /device/update - Update an existing IoT device
router.put("/device/update", validate(updateDeviceSchema), authenticateToken, async (req, res) => {
    try {
        const device = await iotNodeDao.update(req.body);
        if (!device) {
            return res.status(404).json({message: "Device not found"});
        }
        res.json({
            status: 200,
            message: "Upraveno",
            data: device,
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// DELETE /device/delete - Delete an IoT device
router.delete("/device/delete", validate(deleteDeviceSchema), authenticateToken, async (req, res) => {
    try {
        const {id} = req.body;
        if (!id) {
            return res.status(400).json({message: "ID is required"});
        }
        await iotNodeDao.delete(id);
        res.status(200).json({
            status: 200,
            message: "Smazáno",
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;
