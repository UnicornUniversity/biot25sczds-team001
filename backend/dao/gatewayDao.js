// src/dao/gatewayDao.js

const Gateway = require("../models/Gateway");

const gatewayDao = {
  // Vytvoří novou gateway
  create: async (obj) => {
    return await new Gateway(obj).save();
  },

  // Najde gateway podle primárního klíče
  getById: async (id) => {
    return await Gateway.findById(id);
  },

  // **NOVĚ**: najde jednu gateway podle libovolného filtru
  getByFilter: async (filter) => {
    return await Gateway.findOne(filter);
  },

  // Vrátí stránkovaný seznam
  list: async ({ page = 1, pageSize = 10, ownerId, buildingId, created }) => {
    const skip  = (page - 1) * pageSize;
    const query = {};
    if (ownerId    ) query.ownerId    = ownerId;
    if (buildingId ) query.buildingId = buildingId;
    if (created !== undefined) query.created = created;

    const itemList = await Gateway.find(query).skip(skip).limit(pageSize);
    const total    = await Gateway.countDocuments(query);
    return {
      itemList,
      pageInfo: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
    };
  },

  // Vrátí všechny vytvořené gateway bez přiřazené budovy
  getAvailableGateways: async (ownerId) => {
    return await Gateway.find({ ownerId, created: true, buildingId: null });
  },

  // Aktualizuje gateway
  updateById: async (id, updateData) => {
    updateData.updatedAt = new Date();
    return await Gateway.findByIdAndUpdate(id, updateData, { new: true });
  },
};

module.exports = gatewayDao;