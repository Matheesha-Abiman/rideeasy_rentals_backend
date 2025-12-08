import mongoose, { Document, Schema } from "mongoose";

export enum RentalStatus {
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
}

export interface IRENTAL extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  bikeId: mongoose.Types.ObjectId;
  rentalStart: Date;
  rentalEnd: Date;
  totalHours: number;
  totalPrice: number;
  status: RentalStatus;
}

const rentalSchema = new Schema<IRENTAL>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bikeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
    },

    rentalStart: { type: Date, required: true },
    rentalEnd: { type: Date, required: true },

    totalHours: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: Object.values(RentalStatus),
      default: RentalStatus.ONGOING,
    },
  },
  { timestamps: true }
);

export const Rental = mongoose.model<IRENTAL>("Rental", rentalSchema);
