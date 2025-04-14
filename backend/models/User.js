const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        loginName: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        favouriteDoors: [
            {
                type: Number,
                ref: "Dvere",
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updateAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: {createdAt: "createdAt", updatedAt: "updateAt"},
    }
);

// To auto increment ID when registering new user
userSchema.plugin(AutoIncrement, {inc_field: "id"});

module.exports = mongoose.model("User", userSchema);