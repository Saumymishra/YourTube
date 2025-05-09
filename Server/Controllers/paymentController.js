import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../Models/Auth.js"; // Use your existing User model

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// Create order
export const createOrder = async (req, res) => {
    try {
        const options = {
            amount: 5000, // ₹50 in paise
            currency: "INR",
            receipt: `receipt_order_${Math.random() * 1000}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};

// Verify payment and upgrade user
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // Upgrade user to premium
        await User.findByIdAndUpdate(userId, { isPremium: true });
        res.status(200).json({ message: "Payment verified, premium activated" });
    } else {
        res.status(400).json({ message: "Invalid signature, payment verification failed" });
    }
};
