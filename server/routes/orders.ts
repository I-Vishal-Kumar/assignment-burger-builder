import { Router, Request, Response } from "express";
import Order from "../models/Order";
import { SLICE_PRICES, PLATFORM_FEE, SliceType } from "../types";

const router = Router();

// POST /api/orders - create a new order
router.post("/", async (req: Request, res: Response) => {
  try {
    const { customerName, mobile, address, paymentMethod, slices, quantity } = req.body;

    // validation
    if (!customerName || !customerName.trim()) {
      res.status(400).json({ error: "Customer name is required" });
      return;
    }
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      res.status(400).json({ error: "Mobile must be 10 digits" });
      return;
    }
    if (!address || !address.trim()) {
      res.status(400).json({ error: "Address is required" });
      return;
    }
    if (!slices || !Array.isArray(slices) || slices.length === 0) {
      res.status(400).json({ error: "At least one slice is required" });
      return;
    }
    if (!quantity || quantity < 1) {
      res.status(400).json({ error: "Quantity must be at least 1" });
      return;
    }

    // calculate total price on server (don't trust client)
    let sliceTotal = 0;
    for (const s of slices) {
      const price = SLICE_PRICES[s as SliceType];
      if (price === undefined) {
        res.status(400).json({ error: `Invalid slice type: ${s}` });
        return;
      }
      sliceTotal += price;
    }

    // conditional pricing
    if (slices.includes("cheese") && slices.includes("paneer")) {
      sliceTotal -= 3;
    }
    for (let i = 0; i < slices.length - 1; i++) {
      if (slices[i] === "aloo-tikki" && slices[i + 1] === "aloo-tikki") {
        sliceTotal += 2;
      }
    }

    const totalPrice = sliceTotal * quantity + PLATFORM_FEE;

    const order = new Order({
      customerName,
      mobile,
      address,
      paymentMethod,
      slices,
      quantity,
      totalPrice,
      createdAt: new Date(),
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/orders - get all orders
router.get("/", async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
