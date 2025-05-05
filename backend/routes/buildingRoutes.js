const express = require("express");
const router = express.Router();
const buildingDao = require("../dao/buildingDao");
const logDao = require("../dao/logDao");
const validate = require("../middleware/validate");
const authenticateToken = require("../middleware/authTokenValidation");
const Joi = require("joi");

// Validation schemas
const createBuildingSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    ownerId: Joi.string().required(),
});

const updateBuildingSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    ownerId: Joi.string(),
}).min(1);

// GET /buildings - List buildings with optional filtering
router.get("/buildings", authenticateToken, async (req, res) => {
    try {
        const {page = 1, pageSize = 10, ownerId} = req.query;
        const pageInfo = {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            ownerId,
        };
        const result = await buildingDao.list(pageInfo);
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// GET /buildings/:id - Fetch a single building by ID
router.get("/buildings/:id", authenticateToken, async (req, res) => {
    try {
        const building = await buildingDao.get({_id: req.params.id});
        if (!building) {
            return res.status(404).json({message: "Building not found"});
        }
        res.json(building);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// POST /buildings - Create a new building
router.post("/buildings", validate(createBuildingSchema), authenticateToken, async (req, res) => {
    try {
        const building = await buildingDao.create(req.body);
        res.status(201).json({
            status: 200,
            message: "Created",
            data: building,
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// PUT /buildings/:id - Update a building
router.put("/buildings/:id", validate(updateBuildingSchema), authenticateToken, async (req, res) => {
    try {
        const updated = await buildingDao.update({id: req.params.id, ...req.body});
        if (!updated) {
            return res.status(404).json({message: "Building not found"});
        }
        res.json({
            status: 200,
            message: "Updated",
            data: updated,
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// DELETE /buildings/:id - Delete a building
router.delete("/buildings/:id", authenticateToken, async (req, res) => {
    try {
        const result = await buildingDao.delete(req.params.id);
        if (!result) {
            return res.status(404).json({message: "Building not found"});
        }
        res.status(200).json({
            status: 200,
            message: "Deleted",
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// GET /buildings/:id/logs?limit=10&offset=0
router.get("/buildings/:id/logs", authenticateToken, async (req, res) => {
    try {
        const {limit = 10, offset = 0} = req.query;
        const logs = await logDao.listByBuilding({
            buildingId: req.params.id,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.json({
            message: "Logs fetched successfully",
            data: logs,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;