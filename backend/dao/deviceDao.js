const Device = require("../models/Device");

const deviceDao = {
    create: async (uuObject) => {
        return await new Device(uuObject).save();
    },

    get: async (filter) => {
        return await Device.findOne(filter);
    },

    list: async ({page = 1, pageSize = 10, doorId, gatewayId}) => {
        const skip = (page - 1) * pageSize;
        const query = {};
        if (doorId) query.doorId = doorId;
        if (gatewayId) query.gatewayId = gatewayId;

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

    update: async (object) => {
        const {_id, ...updateData} = object;
        updateData.updatedAt = new Date();

        return await Device.findByIdAndUpdate(_id, updateData, {new: true});
    },

    delete: async (_id) => {
        return await Device.findByIdAndDelete(_id);
    },
};

module.exports = deviceDao;