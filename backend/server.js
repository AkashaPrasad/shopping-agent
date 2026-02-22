import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

import chatRoutes from "./routes/chat-route.js";
import authenticationRouter from "./routes/auth-route.js";
import productRoutes from "./routes/product-route.js";
import cartRoutes from "./routes/cart-route.js";
import couponRoutes from "./routes/coupon-route.js";
import paymentRoutes from "./routes/payment-route.js";
import analyticsRoutes from "./routes/analytics-route.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse incoming JSON request bodies
app.use(express.json({ limit: "10mb" })); // limit prevents oversized payloads

// Parse cookies from incoming requests
app.use(cookieParser());

// Auth routes
app.use("/api/auth", authenticationRouter);

// Product routes
app.use("/api/products", productRoutes);

// Cart routes
app.use("/api/cart", cartRoutes);

// Coupon routes
app.use("/api/coupons", couponRoutes);

// Payment routes
app.use("/api/payments", paymentRoutes);

// Analytics routes
app.use("/api/analytics", analyticsRoutes);

// AI ChatBot
app.use("/api/chat", chatRoutes);

// Serve the frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    // Catch-all route to serve the React app for any unmatched routes
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Start the server and connect to the database
app.listen(ENV.PORT, () => {
    console.log("Server is running on http://localhost:" + ENV.PORT);
    connectDB();
});