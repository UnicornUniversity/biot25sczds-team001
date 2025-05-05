const Log = require("../models/Log");

const logDao = {
    create: async (uuObject) => {
        return await new Log(uuObject).save();
    },

    get: async (filter) => {
        return await Log.findOne(filter);
    },

    list: async ({page = 1, pageSize = 10, doorId, severity}) => {
        const skip = (page - 1) * pageSize;
        const query = {};
        if (doorId) query.doorId = doorId;
        if (severity) query.severity = severity;

        const itemList = await Log.find(query).sort({createdAt: -1}).skip(skip).limit(pageSize);
        const total = await Log.countDocuments(query);

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
        const {_id, ...updateData} = object;
        updateData.updatedAt = new Date();

        return await Log.findByIdAndUpdate(_id, updateData, {new: true});
    },

    delete: async (_id) => {
        return await Log.findByIdAndDelete(_id);
    },

    listByBuilding: async ({buildingId, limit = 10, offset = 0}) => {
        const Door = require("../models/Door");
        const doors = await Door.find({buildingId}).select("_id");
        const doorIds = doors.map(d => d._id);
        return await Log.find({doorId: {$in: doorIds}})
            .sort({createdAt: -1})
            .skip(offset)
            .limit(limit);
    },
};

module.exports = logDao;