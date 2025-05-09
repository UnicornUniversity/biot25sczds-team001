const Log = require("../models/Log");
const Door = require("../models/Door");
const Building = require("../models/Building");

const logDao = {
  create: async (uuObject) => {
    return await new Log(uuObject).save();
  },

  get: async (filter) => {
    return await Log.findOne(filter);
  },

  list: async ({ page = 1, pageSize = 10, doorId, severity }) => {
    const skip = (page - 1) * pageSize;
    const query = {};
    if (doorId) query.doorId = doorId;
    if (severity) query.severity = severity;

    const [itemList, total] = await Promise.all([
      Log.find(query)
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(pageSize),
      Log.countDocuments(query)
    ]);

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

  update: async (object) => {
    const { _id, ...updateData } = object;
    updateData.updatedAt = new Date();
    return await Log.findByIdAndUpdate(_id, updateData, { new: true });
  },

  delete: async (_id) => {
    return await Log.findByIdAndDelete(_id);
  },

  listByBuilding: async ({ buildingId, page = 1, pageSize = 10, severity }) => {
    const skip = (page - 1) * pageSize;
    const doors = await Door.find({ buildingId }).select("_id");
    const doorIds = doors.map(d => d._id);

    const query = { doorId: { $in: doorIds } };
    if (severity) query.severity = severity;

    const [itemList, total] = await Promise.all([
      Log.find(query)
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(pageSize),
      Log.countDocuments(query)
    ]);

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

  listByUser: async ({ ownerId, page = 1, pageSize = 10, severity }) => {
    // 1) Najdi budovy, kde building.ownerId === ownerId
    const buildings = await Building.find({ ownerId }).select("_id");
    const buildingIds = buildings.map(b => b._id);

    // 2) Najdi dveře v těchto budovách
    const doors = await Door.find({ buildingId: { $in: buildingIds } }).select("_id");
    const doorIds = doors.map(d => d._id);

    // 3) Sestav filtr pro logy
    const query = { doorId: { $in: doorIds } };
    if (severity) query.severity = severity;

    // 4) Stránkování a počítání
    const skip = (page - 1) * pageSize;
    const [itemList, total] = await Promise.all([
      Log.find(query)
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(pageSize),
      Log.countDocuments(query)
    ]);

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
};

module.exports = logDao;