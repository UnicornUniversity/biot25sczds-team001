const IotNode = require("../models/IotNode");

const iotNodeDao = {
    create: async (uuObject) => {
        const newIotNode = new IotNode(uuObject);
        await newIotNode.save();
        return newIotNode;
    },

    get: async (filter) => {
        return await IotNode.findOne(filter);
    },

    list: async (pageInfo) => {
        const {page = 1, pageSize = 10, doorId} = pageInfo;
        const skip = (page - 1) * pageSize;

        const query = doorId ? {doorId} : {};

        const itemList = await IotNode.find(query)
            .skip(skip)
            .limit(pageSize);

        const total = await IotNode.countDocuments(query);

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
        const updatedIotNode = await IotNode.findOneAndUpdate(
            {id: object.id},
            {...object, updateAt: new Date()},
            {new: true}
        );
        return updatedIotNode;
    },

    delete: async (id) => {
        await IotNode.findOneAndDelete({id});
    },
};

module.exports = iotNodeDao;
