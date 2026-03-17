import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  customerName: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ["UPI", "Cash", "COD", "Net Banking"],
    required: true,
  },
  slices: {
    type: [String],
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
