const Objekt = require("../models/Objekt");

const objektDao = {
    create: async (uuObject) => {
        const newObjekt = new Objekt(uuObject);
        await newObjekt.save();
        return newObjekt;
    },

    get: async (filter) => {
        return await Objekt.findOne(filter);
    },

    list: async (pageInfo) => {
        const {page = 1, pageSize = 10, ownerId} = pageInfo;
        const skip = (page - 1) * pageSize;

        // Build query based on filters
        const query = {};
        if (ownerId) query.ownerId = ownerId;

        const itemList = await Objekt.find(query)
            .skip(skip)
            .limit(pageSize);

        const total = await Objekt.countDocuments(query);

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
        const {id, ...updateData} = object;
        updateData.updateAt = new Date();

        const updatedObjekt = await Objekt.findOneAndUpdate(
            {id},
            updateData,
            {new: true}
        );
        return updatedObjekt;
    },

    delete: async (id) => {
        await Objekt.findOneAndDelete({id});
    },
};

module.exports = objektDao;
