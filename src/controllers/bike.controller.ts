import { Request, Response } from "express";
import { AUthRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";
import { Bike } from "../models/bike.model";

export const createBike = async (req: AUthRequest, res: Response) => {
  try {
    const {
      modelBike,
      brand,
      numberPlate,
      year,
      capacity,
      pricePerDay,
      isAvailable,
    } = req.body;

    let imageURL = "";

    if (req.file) {
      const result: any = await new Promise((resole, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resole(result); // success return
          }
        );
        upload_stream.end(req.file?.buffer);
      });
      imageURL = result.secure_url;
    }
    // "one,two,tree"
    const newBike = new Bike({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fail to create bike" });
  }
};

export const getAllBike = async (req: AUthRequest, res: Response) => {
  try {
    // Correct pagination defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Fetch bikes with pagination
    const bikes = await Bike.find()
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const total = await Bike.countDocuments();

    res.status(200).json({
      message: "Bikes fetched successfully",
      data: bikes,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bikes" });
  }
};

export const editBike = async (req: AUthRequest, res: Response) => {
  try {
    const bikeID = req.params.id as string | 1;
    const {
      modelBike,
      brand,
      numberPlate,
      year,
      capacity,
      pricePerDay,
      isAvailable,
    } = req.body;
    let imageURL = "";

    if (req.file) {
      const result: any = await new Promise((resole, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resole(result);
          }
        );
        upload_stream.end(req.file?.buffer);
      });
      imageURL = result.secure_url;
    }
    const updatedBike = await Bike.findByIdAndUpdate(
      bikeID,
      {
        modelBike,
        brand,
        numberPlate,
        year,
        capacity,
        pricePerDay,
        isAvailable,
        images: imageURL,
      },
      { new: true }
    );
    res.status(201).json({
      message: "Bike updated",
      data: updatedBike,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update bike" });
  }
};

export const deleteBike = async (req: AUthRequest, res: Response) => {
  try {
    const bikeID = req.params.id as string;
    await Bike.findByIdAndDelete(bikeID);
    res.status(200).json({ message: "Bike deleted successfully" });
    if (!bikeID) {
      return res.status(404).json({ message: "Bike not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete bike" });
  }
};

export const getBikeById = async (req: Request, res: Response) => {
  try {
    const bikeId = req.params.id as string;
    console.log("Bike ID to fetch:", bikeId);
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    res.status(200).json({
      message: "Bike data",
      data: bike,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch Bike" });
  }
};

export const searchBike = async (req: Request, res: Response) => {
  try {
    const {modelBike} = req.query;
    const bikes = await Bike.find({
      modelBike: { $regex: new RegExp(modelBike as string, "i") }
    });
    res.status(200).json({
      message: "Bikes found",
      data: bikes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to search bikes" });
  }
};
