const Dvere = require("../models/Dvere");

const dvereDao = {
    create: async (uuObject) => {
        const newDvere = new Dvere(uuObject);
        await newDvere.save();
        return newDvere;
    },

    get: async (filter) => {
        return await Dvere.findOne(filter);
    },

    list: async (pageInfo) => {
        const {page = 1, pageSize = 10, objectId} = pageInfo;
        const skip = (page - 1) * pageSize;

        const query = objectId ? {objectId} : {};

        const itemList = await Dvere.find(query)
            .skip(skip)
            .limit(pageSize);

        const total = await Dvere.countDocuments(query);

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
        const updatedDvere = await Dvere.findOneAndUpdate(
            {id: object.id},
            {...object, updateAt: new Date()},
            {new: true}
        );
        return updatedDvere;
    },

    delete: async (id) => {
        await Dvere.findOneAndDelete({id});
    },
};

module.exports = dvereDao;
