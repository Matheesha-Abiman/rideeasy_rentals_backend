"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.registerUser = void 0;
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tokens_1 = require("../utils/tokens");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const registerUser = async (req, res) => {
    try {
        const { email, password, firstname, lastname } = req.body;
        // left email form model, right side data varible
        //   User.findOne({ email: email })
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email exists" });
        }
        const hash = await bcryptjs_1.default.hash(password, 10);
        //   new User()
        const user = await user_model_1.User.create({
            email,
            password: hash,
            firstname,
            lastname,
            roles: [user_model_1.Role.USER]
        });
        res.status(201).json({
            message: "User registed",
            data: { email: user.email, roles: user.roles }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal; server error"
        });
    }
};
exports.registerUser = registerUser;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = (await user_model_1.User.findOne({ email }));
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const valid = await bcryptjs_1.default.compare(password, existingUser.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const accessToken = (0, tokens_1.signAccessToken)(existingUser);
        const refreshToken = (0, tokens_1.signRefreshToken)(existingUser);
        res.status(200).json({
            message: "success",
            data: {
                email: existingUser.email,
                roles: existingUser.roles,
                accessToken,
                refreshToken
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal; server error"
        });
    }
};
exports.login = login;
