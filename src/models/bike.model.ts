import { time } from "console";
import mongoose, { Document, Schema } from "mongoose";

export interface IBIKE extends Document {
  _id: mongoose.Types.ObjectId;
  images?: string;
  modelBike: string;
  brand: string;
  year: number;
  capacity: number;
  numberPlate: string;
  pricePerDay: number;
  isAvailable: boolean;
}

const userSchema = new Schema<IBIKE>(
  {
    images: { type: String, required: true },
    modelBike: { type: String, required: true },
    brand: { type: String, required: true },
    numberPlate: { type: String, required: true },
    year: { type: Number, required: true },
    capacity: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Bike = mongoose.model<IBIKE>("Bike", userSchema);
