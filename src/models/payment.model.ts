import mongoose, { Document, Schema } from "mongoose";

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  FAILED = "FAILED",
}

export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  ONLINE = "ONLINE",
}

export interface IPAYMENT extends Document {
  _id: mongoose.Types.ObjectId;
  rentalId: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt: Date;
}

const paymentSchema = new Schema<IPAYMENT>(
  {
    rentalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: { type: Number, required: true },

    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },

    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPAYMENT>("Payment", paymentSchema);
