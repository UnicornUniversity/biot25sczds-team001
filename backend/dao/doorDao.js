const Door = require("../models/Door");

const doorDao = {
    create: async (uuObject) => {
        return await new Door(uuObject).save();
    },

    get: async (filter) => {
        return await Door.findOne(filter);
    },

    list: async ({page = 1, pageSize = 10, buildingId}) => {
        const skip = (page - 1) * pageSize;
        const query = buildingId ? {buildingId} : {};

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
        const {_id, ...updateData} = object;
        updateData.updatedAt = new Date();

        return await Door.findByIdAndUpdate(_id, updateData, {new: true});
    },

    delete: async (_id) => {
        return await Door.findByIdAndDelete(_id);
    },
};

module.exports = doorDao;