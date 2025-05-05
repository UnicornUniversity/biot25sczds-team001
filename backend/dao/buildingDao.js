const Building = require("../models/Building");

const buildingDao = {
    create: async (uuObject) => {
        const newBuilding = new Building(uuObject);
        await newBuilding.save();
        return newBuilding;
    },

    get: async (filter) => {
        return await Building.findOne(filter);
    },

    list: async ({page = 1, pageSize = 10, ownerId}) => {
        const skip = (page - 1) * pageSize;
        const query = {};
        if (ownerId) query.ownerId = ownerId;

        const itemList = await Building.find(query).skip(skip).limit(pageSize);
        const total = await Building.countDocuments(query);

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

        return await Building.findByIdAndUpdate(_id, updateData, {new: true});
    },

    delete: async (_id) => {
        return await Building.findByIdAndDelete(_id);
    },
};

module.exports = buildingDao;