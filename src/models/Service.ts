import mongoose, { Model, Schema } from "mongoose";
import { IService } from "../types";

const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    category: {
      type: String,
      enum: ["Baby Care", "Elderly Service", "Sick People Service"],
      required: [true, "Service category is required"],
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", serviceSchema);

export default Service;
