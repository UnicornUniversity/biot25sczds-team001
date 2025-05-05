const Gateway = require("../models/Gateway");

const gatewayDao = {
    create: async (uuObject) => {
        return await new Gateway(uuObject).save();
    },

    get: async (filter) => {
        return await Gateway.findOne(filter);
    },

    getById: async (_id) => {
        return await Gateway.findById(_id);
    },

    list: async ({page = 1, pageSize = 10, ownerId, buildingId, created}) => {
        const skip = (page - 1) * pageSize;
        const query = {};
        if (ownerId) query.ownerId = ownerId;
        if (buildingId) query.buildingId = buildingId;
        if (created !== undefined) query.created = created;

        const itemList = await Gateway.find(query).skip(skip).limit(pageSize);
        const total = await Gateway.countDocuments(query);

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
        return await Gateway.findByIdAndUpdate(_id, updateData, {new: true});
    },

    deleteById: async (_id) => {
        return await Gateway.findByIdAndDelete(_id);
    },
};

module.exports = gatewayDao;