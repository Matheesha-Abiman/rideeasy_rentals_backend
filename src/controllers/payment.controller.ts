import { Request, Response } from "express";
import { AUthRequest } from "../middleware/auth";
import { Payment } from "../models/payment.model";
import { Rental, RentalStatus } from "../models/rental.model";

export const createPayment = async (req: AUthRequest, res: Response) => {
  try {
    const { rentalId, amount, method } = req.body;

    if (!rentalId || !amount || !method) {
      return res.status(400).json({ message: "rentalId, amount, and method are required" });
    }

    const rentalData = await Rental.findById(rentalId);
    if (!rentalData) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const payment = await Payment.create({
      rentalId,
      user: req.user.sub,
      amount,
      method,
      status: "PAID",
    });

    // Update rental status
    rentalData.status = RentalStatus.COMPLETED;
    await rentalData.save();

    res.status(201).json({
      message: "Payment successful",
      data: payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment failed" });
  }
};

export const getAllPayments = async (req: AUthRequest, res: Response) => {
  try {
    const payments = await Payment.find()
      .populate("rentalId")
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Payments fetched",
      data: payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get payments" });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const paymentID = req.params.id;

    const payment = await Payment.findById(paymentID)
      .populate("rentalId")
      .populate("user");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({
      message: "Payment data",
      data: payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch payment" });
  }
};

export const deletePayment = async (req: AUthRequest, res: Response) => {
  try {
    const paymentID = req.params.id;

    const payment = await Payment.findById(paymentID);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await Payment.findByIdAndDelete(paymentID);

    res.status(200).json({ message: "Payment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete payment" });
  }
};
