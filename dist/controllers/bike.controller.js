"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBike = exports.getBikeById = exports.deleteBike = exports.editBike = exports.getAllBike = exports.createBike = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const bike_model_1 = require("../models/bike.model");
const createBike = async (req, res) => {
    try {
        const { modelBike, brand, numberPlate, year, capacity, pricePerDay, isAvailable, } = req.body;
        let imageURL = "";
        if (req.file) {
            const result = await new Promise((resole, reject) => {
                const upload_stream = cloudinary_1.default.uploader.upload_stream({ folder: "posts" }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resole(result); // success return
                });
                upload_stream.end(req.file?.buffer);
            });
            imageURL = result.secure_url;
        }
        // "one,two,tree"
        const newBike = new bike_model_1.Bike({
            images: imageURL,
            modelBike,
            brand,
            numberPlate,
            year,
            capacity,
            pricePerDay,
            isAvailable,
            author: req.user.sub, // from auth middleware
        });
        await newBike.save();
        res.status(201).json({
            message: "Bike created",
            data: newBike,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Fail to create bike" });
    }
};
exports.createBike = createBike;
const getAllBike = async (req, res) => {
    try {
        // Correct pagination defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        // Fetch bikes with pagination
        const bikes = await bike_model_1.Bike.find()
            .sort({ createdAt: -1 }) // newest first
            .skip(skip)
            .limit(limit);
        const total = await bike_model_1.Bike.countDocuments();
        res.status(200).json({
            message: "Bikes fetched successfully",
            data: bikes,
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch bikes" });
    }
};
exports.getAllBike = getAllBike;
const editBike = async (req, res) => {
    try {
        const bikeID = req.params.id;
        const { modelBike, brand, numberPlate, year, capacity, pricePerDay, isAvailable, } = req.body;
        let imageURL = "";
        if (req.file) {
            const result = await new Promise((resole, reject) => {
                const upload_stream = cloudinary_1.default.uploader.upload_stream({ folder: "posts" }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resole(result);
                });
                upload_stream.end(req.file?.buffer);
            });
            imageURL = result.secure_url;
        }
        const updatedBike = await bike_model_1.Bike.findByIdAndUpdate(bikeID, {
            modelBike,
            brand,
            numberPlate,
            year,
            capacity,
            pricePerDay,
            isAvailable,
            images: imageURL,
        }, { new: true });
        res.status(201).json({
            message: "Bike updated",
            data: updatedBike,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update bike" });
    }
};
exports.editBike = editBike;
const deleteBike = async (req, res) => {
    try {
        const bikeID = req.params.id;
        await bike_model_1.Bike.findByIdAndDelete(bikeID);
        res.status(200).json({ message: "Bike deleted successfully" });
        if (!bikeID) {
            return res.status(404).json({ message: "Bike not found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete bike" });
    }
};
exports.deleteBike = deleteBike;
const getBikeById = async (req, res) => {
    try {
        const bikeId = req.params.id;
        console.log("Bike ID to fetch:", bikeId);
        const bike = await bike_model_1.Bike.findById(bikeId);
        if (!bike) {
            return res.status(404).json({ message: "Bike not found" });
        }
        res.status(200).json({
            message: "Bike data",
            data: bike,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch Bike" });
    }
};
exports.getBikeById = getBikeById;
const searchBike = async (req, res) => {
    try {
        const { modelBike } = req.query;
        const bikes = await bike_model_1.Bike.find({
            modelBike: { $regex: new RegExp(modelBike, "i") }
        });
        res.status(200).json({
            message: "Bikes found",
            data: bikes,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to search bikes" });
    }
};
exports.searchBike = searchBike;
