import mongoose, { Document, Schema } from "mongoose"

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}

export interface IUSER extends Document {
  _id: mongoose.Types.ObjectId
  firstname?: string
  lastname?: string
  email: string
  password: string
  roles: Role[]
}

const userSchema = new Schema<IUSER>({
  email: { type: String, unique: true, lowercase: true, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  roles: { type: [String], enum: Object.values(Role), default: [Role.USER] },
})

export const User = mongoose.model<IUSER>("User", userSchema)