const Log = require("../models/Log");

const logDao = {
    create: async (uuObject) => {
        const newLog = new Log(uuObject);
        await newLog.save();
        return newLog;
    },

    get: async (filter) => {
        return await Log.findOne(filter);
    },

    list: async (pageInfo) => {
        const {page = 1, pageSize = 10, relatedDoor, severity} = pageInfo;
        const skip = (page - 1) * pageSize;

        const query = {};
        if (relatedDoor) query.relatedDoor = relatedDoor;
        if (severity) query.severity = severity;

        const itemList = await Log.find(query)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(pageSize);

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
        const updatedLog = await Log.findOneAndUpdate(
            {id: object.id},
            {...object, updateAt: new Date()},
            {new: true}
        );
        return updatedLog;
    },

    delete: async (id) => {
        await Log.findOneAndDelete({id});
    },
};

module.exports = logDao;
