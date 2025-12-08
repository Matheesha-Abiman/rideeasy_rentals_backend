"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayment = exports.getPaymentById = exports.getAllPayments = exports.createPayment = void 0;
const payment_model_1 = require("../models/payment.model");
const rental_model_1 = require("../models/rental.model");
const createPayment = async (req, res) => {
    try {
        const { rentalId, amount, method } = req.body;
        if (!rentalId || !amount || !method) {
            return res.status(400).json({ message: "rentalId, amount, and method are required" });
        }
        const rentalData = await rental_model_1.Rental.findById(rentalId);
        if (!rentalData) {
            return res.status(404).json({ message: "Rental not found" });
        }
        const payment = await payment_model_1.Payment.create({
            rentalId,
            user: req.user.sub,
            amount,
            method,
            status: "PAID",
        });
        // Update rental status
        rentalData.status = rental_model_1.RentalStatus.COMPLETED;
        await rentalData.save();
        res.status(201).json({
            message: "Payment successful",
            data: payment,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Payment failed" });
    }
};
exports.createPayment = createPayment;
const getAllPayments = async (req, res) => {
    try {
        const payments = await payment_model_1.Payment.find()
            .populate("rentalId")
            .populate("user")
            .sort({ createdAt: -1 });
        res.status(200).json({
            message: "Payments fetched",
            data: payments,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get payments" });
    }
};
exports.getAllPayments = getAllPayments;
const getPaymentById = async (req, res) => {
    try {
        const paymentID = req.params.id;
        const payment = await payment_model_1.Payment.findById(paymentID)
            .populate("rentalId")
            .populate("user");
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json({
            message: "Payment data",
            data: payment,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch payment" });
    }
};
exports.getPaymentById = getPaymentById;
const deletePayment = async (req, res) => {
    try {
        const paymentID = req.params.id;
        const payment = await payment_model_1.Payment.findById(paymentID);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        await payment_model_1.Payment.findByIdAndDelete(paymentID);
        res.status(200).json({ message: "Payment deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete payment" });
    }
};
exports.deletePayment = deletePayment;
