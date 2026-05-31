import mongoose, { Model, Schema } from "mongoose";
import { IBooking } from "../types";

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service ID is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    durationType: {
      type: String,
      enum: ["days", "hours"],
      required: [true, "Duration type (days/hours) is required"],
    },
    location: {
      division: { type: String, required: [true, "Division is required"] },
      district: { type: String, required: [true, "District is required"] },
      city: { type: String, required: [true, "City is required"] },
      area: { type: String, required: [true, "Area or Address is required"] },
    },
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
