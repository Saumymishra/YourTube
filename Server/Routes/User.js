import express from "express";
import { login } from "../Controllers/Auth.js";
import { updatechaneldata, getallchanels } from "../Controllers/channel.js";
import { createOrder, verifyPayment } from "../Controllers/paymentController.js"; // ➕ Add Razorpay controllers

const routes = express.Router();

routes.post('/login', login);
routes.patch('/update/:id', updatechaneldata);
routes.get('/getallchannel', getallchanels);

// 🔽 Razorpay Routes
routes.post('/create-order', createOrder);       // ➕ Create payment order
routes.post('/verify-payment', verifyPayment);   // ➕ Verify and activate premium

export default routes;
