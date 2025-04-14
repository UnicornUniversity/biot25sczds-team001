const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

const authDao = {
    register: async ({name, loginName, password}) => {
        const existingUser = await User.findOne({loginName});
        if (existingUser) {
            throw new Error("User with this login name already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({
            name,
            loginName,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign(
            {
                id: newUser.id,
                loginName: newUser.loginName,
                name: newUser.name,
            },
            JWT_SECRET,
            {expiresIn: "7d"}
        );

        return {
            message: "User registered successfully!",
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                loginName: newUser.loginName,
            },
        };
    },

    login: async ({loginName, password}) => {
        const user = await User.findOne({loginName});
        if (!user) {
            throw new Error("Invalid credentials.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials.");
        }

        const token = jwt.sign(
            {
                id: user.id,
                loginName: user.loginName,
                name: user.name,
            },
            JWT_SECRET,
            {expiresIn: "7d"}
        );

        return {
            message: "Login successful!",
            token,
            user: {
                id: user.id,
                name: user.name,
                loginName: user.loginName,
            },
        };
    },
};

module.exports = authDao;