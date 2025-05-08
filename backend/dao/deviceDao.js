const Device = require("../models/Device");

const deviceDao = {
  create: async uuObject => {
    return await new Device(uuObject).save();
  },

  getById: async (_id) => {
    return await Device.findById(_id);
  },

  updateMany: async (filter, updateData) => {
    return await Device.updateMany(filter, updateData);
  },

  list: async ({ page = 1, pageSize = 10, ownerId, doorId, gatewayId, created }) => {
    const skip = (page - 1) * pageSize;
    const query = { ownerId }; // *** filtrovat jen patřící uživateli ***
    if (doorId)    query.doorId    = doorId;
    if (gatewayId) query.gatewayId = gatewayId;
    if (created !== undefined) query.created = created;

    const itemList = await Device.find(query).skip(skip).limit(pageSize);
    const total    = await Device.countDocuments(query);

    return {
      itemList,
      pageInfo: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  updateById: async (_id, updateData, ownerId) => {
    // ověříme, že ten device patří ownerId
    const existing = await Device.findById(_id);
    if (!existing || existing.ownerId !== ownerId) return null;
    updateData.updatedAt = new Date();
    return await Device.findByIdAndUpdate(_id, updateData, { new: true });
  },

  deleteById: async (_id, ownerId) => {
    const existing = await Device.findById(_id);
    if (!existing || existing.ownerId !== ownerId) return null;
    return await Device.findByIdAndDelete(_id);
  },

  // šablony controllerů: created=false
  getTemplates: async (gatewayId) => {
    return await Device.find({ gatewayId, created: false });
  },

  // reálné controllery (created=true, bez doorId), filtrované podle ownerId
  getAvailableControllers: async (ownerId, gatewayId) => {
    const query = { ownerId, created: true, doorId: null };
    if (gatewayId) query.gatewayId = gatewayId;
    return await Device.find(query);
  },
};

module.exports = deviceDao;