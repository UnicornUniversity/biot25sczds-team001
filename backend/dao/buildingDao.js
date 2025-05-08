// dao/buildingDao.js
const Building = require("../models/Building");

const buildingDao = {
  create: async ({ name, description, ownerId }) => {
    const b = new Building({ name, description, ownerId });
    await b.save();
    return b;
  },

  get: async (filter) => {
    return await Building.findOne(filter);
  },

  list: async ({ page = 1, pageSize = 10, ownerId }) => {
    const skip = (page - 1) * pageSize;
    const query = { ownerId };
    const itemList = await Building.find(query).skip(skip).limit(pageSize);
    const total    = await Building.countDocuments(query);
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

  update: async ({ id, name, description }) => {
    return await Building.findByIdAndUpdate(
      id,
      { name, description, updatedAt: new Date() },
      { new: true }
    );
  },

  delete: async (id) => {
    return await Building.findByIdAndDelete(id);
  },
};

module.exports = buildingDao;