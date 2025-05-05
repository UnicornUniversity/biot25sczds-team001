const Device = require("../models/Device");

const deviceDao = {
    create: async (uuObject) => {
        return await new Device(uuObject).save();
    },

    get: async (filter) => {
        return await Device.findOne(filter);
    },

    getById: async (_id) => {
        return await Device.findById(_id);
    },

    list: async ({page = 1, pageSize = 10, doorId, gatewayId, created}) => {
        const skip = (page - 1) * pageSize;
        const query = {};
        if (doorId) query.doorId = doorId;
        if (gatewayId) query.gatewayId = gatewayId;
        if (created !== undefined) query.created = created;

        const itemList = await Device.find(query).skip(skip).limit(pageSize);
        const total = await Device.countDocuments(query);

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

    updateById: async (_id, updateData) => {
        updateData.updatedAt = new Date();
        return await Device.findByIdAndUpdate(_id, updateData, {new: true});
    },

    deleteById: async (_id) => {
        return await Device.findByIdAndDelete(_id);
    },
};

module.exports = deviceDao;