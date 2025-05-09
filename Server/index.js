import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import videoroutes from './Routes/video.js';
import userroutes from "./Routes/User.js";
import commentroutes from './Routes/comment.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url)); 

dotenv.config();
const app = express();

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from the React frontend
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allow these methods
    credentials: true, // Allow cookies if using authentication
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow custom headers like Authorization
};
app.use(cors(corsOptions));

// Middleware for JSON body parsing
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
    res.send("YourTube is working");
});

// Additional middlewares
app.use(bodyParser.json());

// Routes for user, video, and comment
app.use('/user', userroutes);  // User-related routes
app.use('/video', videoroutes);  // Video-related routes
app.use('/comment', commentroutes);  // Comment-related routes

// Set Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy headers
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});

// Database connection
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL)
    .then(() => {
        console.log("MongoDB Database connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
