const express = require("express");
const router = express.Router();
const objektDao = require("../dao/buildingDao");
const validate = require("../middleware/validate");
const authenticateToken = require("../middleware/authTokenValidation");
const Joi = require("joi");

// Validation schemas
const createObjectSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    ownerId: Joi.string().required(),
});

const updateObjectSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string(),
    ownerId: Joi.string(),
}).min(2); // At least id and one field to update

const deleteObjectSchema = Joi.object({
    id: Joi.string().required(),
});

// GET /object - List objects with optional filtering
router.get("/object", authenticateToken, async (req, res) => {
    try {
        const {page = 1, pageSize = 10, ownerId} = req.query;
        const pageInfo = {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            ownerId,
        };
        const result = await objektDao.list(pageInfo);
        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// POST /object/create - Create a new object
router.post("/object/create", validate(createObjectSchema), authenticateToken, async (req, res) => {
    try {
        const objekt = await objektDao.create(req.body);
        res.status(201).json({
            status: 200,
            message: "Založeno",
            data: objekt,
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// PUT /object/update - Update an existing object
router.put("/object/update", validate(updateObjectSchema), authenticateToken, async (req, res) => {
    try {
        const objekt = await objektDao.update(req.body);
        if (!objekt) {
            return res.status(404).json({message: "Objekt not found"});
        }
        res.json({
            status: 200,
            message: "Upraveno",
            data: objekt,
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// DELETE /object/delete - Delete an object
router.delete("/object/delete", validate(deleteObjectSchema), authenticateToken, async (req, res) => {
    try {
        const {id} = req.body;
        if (!id) {
            return res.status(400).json({message: "ID is required"});
        }
        await objektDao.delete(id);
        res.status(200).json({
            status: 200,
            message: "Smazáno",
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;
