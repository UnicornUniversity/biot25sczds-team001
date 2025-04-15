const express = require("express");
const router = express.Router();
const dvereDao = require("../dao/dvereDao");
const validate = require("../middleware/validate");
const authenticateToken = require("../middleware/authTokenValidation");
const Joi = require("joi");

// Validation schemas
const createDoorSchema = Joi.object({
    objectId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    locked: Joi.boolean().default(true),
});

const updateDoorSchema = Joi.object({
    id: Joi.string().required(),
    objectId: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    locked: Joi.boolean(),
}).min(2); // At least id and one field to update

const deleteDoorSchema = Joi.object({
    id: Joi.string().required(),
});

// TODO: update based on FE needs
// GET /object/:objectId/door - List doors for a specific object
router.get("/object/:objectId/door", authenticateToken, async (req, res) => {
    try {
        const {objectId} = req.params;
        const {page = 1, pageSize = 10} = req.query;
        const pageInfo = {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            objectId,
        };
        const result = await dvereDao.list(pageInfo);
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// POST /door/create - Create a new door
router.post("/door/create", validate(createDoorSchema), authenticateToken, async (req, res) => {
    try {
        const door = await dvereDao.create(req.body);
        res.status(201).json({
            status: 200,
            message: "Vytvořeno",
            data: door,
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// PUT /door/update - Update an existing door
router.put("/door/update", validate(updateDoorSchema), authenticateToken, async (req, res) => {
    try {
        const door = await dvereDao.update(req.body);
        if (!door) {
            return res.status(404).json({message: "Door not found"});
        }
        res.json({
            status: 200,
            message: "Upraveno",
            data: door,
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// DELETE /door/delete - Delete a door
router.delete("/door/delete", validate(deleteDoorSchema), authenticateToken, async (req, res) => {
    try {
        const {id} = req.body;
        if (!id) {
            return res.status(400).json({message: "ID is required"});
        }
        await dvereDao.delete(id);
        res.status(200).json({
            status: 200,
            message: "Smazáno",
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;
