"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRental = exports.updateRentalStatus = exports.getRentalById = exports.getAllRentals = exports.createRental = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const rental_model_1 = require("../models/rental.model");
const bike_model_1 = require("../models/bike.model");
const rental_model_2 = require("../models/rental.model");
const createRental = async (req, res) => {
    console.log("Create Rental Request Body:", req.body);
    try {
        const { bikeId, hours } = req.body;
        const userId = req.user.sub;
        if (!mongoose_1.default.Types.ObjectId.isValid(bikeId)) {
            return res.status(400).json({ message: "Invalid bike ID" });
        }
        const selectedBike = await bike_model_1.Bike.findById(bikeId);
        if (!selectedBike) {
            return res.status(404).json({ message: "Bike not found" });
        }
        if (!selectedBike.isAvailable) {
            return res.status(400).json({ message: "Bike is already rented" });
        }
        const rentalStart = new Date();
        const rentalEnd = new Date(rentalStart.getTime() + hours * 60 * 60 * 1000);
        const totalHours = hours;
        const totalPrice = totalHours * (selectedBike.pricePerDay / 24);
        const rental = await rental_model_1.Rental.create({
            userId,
            bikeId,
            rentalStart,
            rentalEnd,
            totalHours,
            totalPrice,
            status: rental_model_2.RentalStatus.ONGOING,
        });
        await bike_model_1.Bike.findByIdAndUpdate(bikeId, { isAvailable: false });
        res.status(201).json({
            message: "Rental created successfully",
            data: rental,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create rental" });
    }
};
exports.createRental = createRental;
const getAllRentals = async (req, res) => {
    try {
        const rentals = await rental_model_1.Rental.find()
            .populate("userId")
            .populate("bikeId")
            .sort({ createdAt: -1 });
        res.status(200).json({
            message: "All rentals fetched",
            data: rentals,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch rentals" });
    }
};
exports.getAllRentals = getAllRentals;
const getRentalById = async (req, res) => {
    try {
        const rentalID = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(rentalID)) {
            return res.status(400).json({ message: "Invalid rental ID" });
        }
        const rental = await rental_model_1.Rental.findById(rentalID)
            .populate("userId")
            .populate("bikeId");
        if (!rental) {
            return res.status(404).json({ message: "Rental not found" });
        }
        res.status(200).json({
            message: "Rental data fetched",
            data: rental,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch rental" });
    }
};
exports.getRentalById = getRentalById;
const updateRentalStatus = async (req, res) => {
    try {
        const rentalID = req.params.id;
        const { status } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(rentalID)) {
            return res.status(400).json({ message: "Invalid rental ID" });
        }
        const rental = await rental_model_1.Rental.findById(rentalID);
        if (!rental) {
            return res.status(404).json({ message: "Rental not found" });
        }
        const bikeId = rental.bikeId;
        if (status === rental_model_2.RentalStatus.COMPLETED) {
            await bike_model_1.Bike.findByIdAndUpdate(bikeId, { isAvailable: true });
        }
        rental.status = status;
        await rental.save();
        res.status(200).json({
            message: "Rental status updated",
            data: rental,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update rental" });
    }
};
exports.updateRentalStatus = updateRentalStatus;
const deleteRental = async (req, res) => {
    try {
        const rentalID = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(rentalID)) {
            return res.status(400).json({ message: "Invalid rental ID" });
        }
        const rental = await rental_model_1.Rental.findById(rentalID);
        if (!rental) {
            return res.status(404).json({ message: "Rental not found" });
        }
        await bike_model_1.Bike.findByIdAndUpdate(rental.bikeId, { isAvailable: true });
        await rental_model_1.Rental.findByIdAndDelete(rentalID);
        res.status(200).json({
            message: "Rental deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete rental" });
    }
};
exports.deleteRental = deleteRental;
