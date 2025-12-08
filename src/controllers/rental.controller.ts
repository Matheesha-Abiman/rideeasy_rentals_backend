import { Request, Response } from "express";
import { AUthRequest } from "../middleware/auth";
import mongoose from "mongoose";
import { Rental } from "../models/rental.model";
import { Bike } from "../models/bike.model";
import { RentalStatus } from "../models/rental.model";

export const createRental = async (req: AUthRequest, res: Response) => {
  console.log("Create Rental Request Body:", req.body);
  try {
    const { bikeId, hours } = req.body;
    const userId = req.user.sub;

    if (!mongoose.Types.ObjectId.isValid(bikeId)) {
      return res.status(400).json({ message: "Invalid bike ID" });
    }

    const selectedBike = await Bike.findById(bikeId);
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

    const rental = await Rental.create({
      userId,
      bikeId,
      rentalStart,
      rentalEnd,
      totalHours,
      totalPrice,
      status: RentalStatus.ONGOING,
    });

    await Bike.findByIdAndUpdate(bikeId, { isAvailable: false });

    res.status(201).json({
      message: "Rental created successfully",
      data: rental,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create rental" });
  }
};

export const getAllRentals = async (req: AUthRequest, res: Response) => {
  try {
    const rentals = await Rental.find()
      .populate("userId")
      .populate("bikeId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All rentals fetched",
      data: rentals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch rentals" });
  }
};

export const getRentalById = async (req: Request, res: Response) => {
  try {
    const rentalID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(rentalID)) {
      return res.status(400).json({ message: "Invalid rental ID" });
    }

    const rental = await Rental.findById(rentalID)
      .populate("userId")
      .populate("bikeId");

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    res.status(200).json({
      message: "Rental data fetched",
      data: rental,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch rental" });
  }
};

export const updateRentalStatus = async (req: AUthRequest, res: Response) => {
  try {
    const rentalID = req.params.id;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(rentalID)) {
      return res.status(400).json({ message: "Invalid rental ID" });
    }

    const rental = await Rental.findById(rentalID);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const bikeId = rental.bikeId;

    if (status === RentalStatus.COMPLETED) {
      await Bike.findByIdAndUpdate(bikeId, { isAvailable: true });
    }

    rental.status = status;
    await rental.save();

    res.status(200).json({
      message: "Rental status updated",
      data: rental,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update rental" });
  }
};

export const deleteRental = async (req: AUthRequest, res: Response) => {
  try {
    const rentalID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(rentalID)) {
      return res.status(400).json({ message: "Invalid rental ID" });
    }

    const rental = await Rental.findById(rentalID);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    await Bike.findByIdAndUpdate(rental.bikeId, { isAvailable: true });

    await Rental.findByIdAndDelete(rentalID);

    res.status(200).json({
      message: "Rental deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete rental" });
  }
};
