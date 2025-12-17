import mongoose from "mongoose";

const CareerApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    education: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model(
  "CareerApplication",
  CareerApplicationSchema
);
