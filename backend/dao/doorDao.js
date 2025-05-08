// dao/doorDao.js
const Door = require("../models/Door");
const User = require("../models/User");
const Log = require("../models/Log");

const doorDao = {
  create: async (uuObject) => {
    return await new Door(uuObject).save();
  },

  get: async (filter) => {
    return await Door.findOne(filter);
  },

  list: async ({ page = 1, pageSize = 10, buildingId }) => {
    const skip = (page - 1) * pageSize;
    const query = buildingId ? { buildingId } : {};

    const itemList = await Door.find(query).skip(skip).limit(pageSize);
    const total = await Door.countDocuments(query);

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
    return await Door.findByIdAndUpdate(_id, updateData, { new: true });
  },

  delete: async (_id) => {
    return await Door.findByIdAndDelete(_id);
  },

  toggleState: async (_id, newState) => {
    return await Door.findByIdAndUpdate(
      _id,
      { state: newState, updatedAt: new Date() },
      { new: true }
    );
  },

  toggleLock: async (_id) => {
    const door = await Door.findById(_id);
    if (!door) return null;
    door.locked = !door.locked;
    door.updatedAt = new Date();
    return await door.save();
  },

  toggleFavourite: async (userId, doorId) => {
    // Načteme uživatele podle jeho _id
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Pokud už tam doorId je, odebereme ho, jinak přidáme
    const idx = user.favouriteDoors.indexOf(doorId);
    if (idx > -1) {
      user.favouriteDoors.splice(idx, 1);
    } else {
      user.favouriteDoors.push(doorId);
    }

    await user.save();

    // Vrátíme jen aktuální pole favouriteDoors
    return user.favouriteDoors;
  },

  getLogs: async (doorId, limit = 10, offset = 0) => {
    return await Log.find({ doorId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
  },
};

module.exports = doorDao;