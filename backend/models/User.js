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
                type: String,
                ref: "Door",
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

userSchema.plugin(AutoIncrement, {inc_field: "id"});

module.exports = mongoose.model("User", userSchema);