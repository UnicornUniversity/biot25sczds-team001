const Log = require("../models/Log");
const Door = require("../models/Door");
const Building = require("../models/Building");

/**
 * Konfigurace pro nested populate:
 *   Log → doorId (name, buildingId) → buildingId (name)
 */
const POPULATE = {
  path: "doorId",
  select: "name buildingId",
  populate: { path: "buildingId", select: "name" },
};

/**
 * Vloží do každého záznamu odvozená pole doorName a buildingName
 * (pro frontend pohodlné čtení; originální nested objekty zůstávají).
 */
function enrich(docs) {
  return docs.map((d) => ({
    ...d,
    doorName: d.doorId?.name || null,
    buildingName: d.doorId?.buildingId?.name || null,
  }));
}

const logDao = {
  /* ---------- CRUD ---------- */
  create: async (uuObject) => {
    return new Log(uuObject).save();
  },

  get: async (filter) => {
    return Log.findOne(filter).populate(POPULATE);
  },

  update: async (object) => {
    const { _id, ...updateData } = object;
    updateData.updatedAt = new Date();
    return Log.findByIdAndUpdate(_id, updateData, { new: true }).populate(POPULATE);
  },

  delete: async (_id) => {
    return Log.findByIdAndDelete(_id);
  },

  /* ---------- LISTY ---------- */
  list: async ({ page = 1, pageSize = 10, doorId, severity }) => {
    const skip = (page - 1) * pageSize;
    const query = {};
    if (doorId) query.doorId = doorId;
    if (severity) query.severity = severity;

    const [docs, total] = await Promise.all([
      Log.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate(POPULATE)
        .lean(),
      Log.countDocuments(query),
    ]);

    return {
      itemList: enrich(docs),
      pageInfo: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  listByBuilding: async ({ buildingId, page = 1, pageSize = 10, severity }) => {
    const skip = (page - 1) * pageSize;
    const doors = await Door.find({ buildingId }).select("_id");
    const doorIds = doors.map((d) => d._id);

    const query = { doorId: { $in: doorIds } };
    if (severity) query.severity = severity;

    const [docs, total] = await Promise.all([
      Log.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate(POPULATE)
        .lean(),
      Log.countDocuments(query),
    ]);

    return {
      itemList: enrich(docs),
      pageInfo: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  listByUser: async ({ ownerId, page = 1, pageSize = 10, severity }) => {
    // 1) Budovy uživatele
    const buildings = await Building.find({ ownerId }).select("_id");
    const buildingIds = buildings.map((b) => b._id);

    // 2) Dveře ve vybraných budovách
    const doors = await Door.find({ buildingId: { $in: buildingIds } }).select("_id");
    const doorIds = doors.map((d) => d._id);

    // 3) Filtr pro logy
    const query = { doorId: { $in: doorIds } };
    if (severity) query.severity = severity;

    // 4) Stránkování + count
    const skip = (page - 1) * pageSize;
    const [docs, total] = await Promise.all([
      Log.find(query)
        .sort({ createdAt: -1 }) // respektujeme původní asc pořadí
        .skip(skip)
        .limit(pageSize)
        .populate(POPULATE)
        .lean(),
      Log.countDocuments(query),
    ]);

    return {
      itemList: enrich(docs),
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
