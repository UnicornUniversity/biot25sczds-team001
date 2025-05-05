const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Import middleware
const validate = require('../middleware/validate');

// Import models
const Objekt = require('../models/Building');
const Dvere = require('../models/Door');
const IotNode = require('../models/Device');
const Log = require('../models/Log');

// Import DAOs
const objektDao = require('../dao/buildingDao');
const dvereDao = require('../dao/doorDao');
const iotNodeDao = require('../dao/deviceDao');
const logDao = require('../dao/logDao');

// Validation schemas
const Joi = require('joi');

// Object validation schemas
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
}).min(2);

// Door validation schemas
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
}).min(2);

// Device validation schemas
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
}).min(2);

// Log validation schemas
const createLogSchema = Joi.object({
    severity: Joi.string().valid("info", "warning", "error").required(),
    message: Joi.string().required(),
    relatedDoor: Joi.string().allow(null),
});

// Object routes
app.get("/object", async (req, res) => {
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

app.post("/object/create", validate(createObjectSchema), async (req, res) => {
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

app.put("/object/update", validate(updateObjectSchema), async (req, res) => {
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

app.delete("/object/delete", async (req, res) => {
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

// Door routes
app.get("/object/:objectId/door", async (req, res) => {
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

app.post("/door/create", validate(createDoorSchema), async (req, res) => {
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

app.put("/door/update", validate(updateDoorSchema), async (req, res) => {
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

app.delete("/door/delete", async (req, res) => {
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

// Device routes
app.get("/device", async (req, res) => {
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

app.post("/device/create", validate(createDeviceSchema), async (req, res) => {
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

app.put("/device/update", validate(updateDeviceSchema), async (req, res) => {
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

app.delete("/device/delete", async (req, res) => {
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

// Log routes
app.get("/logs", async (req, res) => {
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

app.post("/log/create", validate(createLogSchema), async (req, res) => {
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: "Something went wrong!"});
});

module.exports = app;
