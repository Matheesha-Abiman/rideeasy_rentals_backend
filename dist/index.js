"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const bike_1 = __importDefault(require("./routes/bike"));
const payment_1 = __importDefault(require("./routes/payment"));
const rental_1 = __importDefault(require("./routes/rental"));
const auth_2 = require("./middleware/auth");
dotenv_1.default.config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["https://rideeasy-rentals-frontend.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"], // optional
}));
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/bike", auth_2.authenticate, bike_1.default);
app.use("/api/v1/rental", auth_2.authenticate, rental_1.default);
app.use("/api/v1/payment", auth_2.authenticate, payment_1.default);
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("DB connected");
})
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
app.listen(PORT, () => {
    console.log("Server is running");
});
