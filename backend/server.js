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

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

/* =========================
   ✅ ROOT ROUTE (IMPORTANT)
========================= */
app.get("/", (req, res) => {
  res.send("Backend is LIVE 🚀");
});

/* =========================
   ✅ API ROUTES
========================= */
app.use("/api/auth", authenticationRouter);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);

/* =========================
   ✅ HEALTH CHECK (OPTIONAL)
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* =========================
   ✅ SERVE FRONTEND (OPTIONAL)
========================= */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

/* =========================
   ✅ START SERVER
========================= */
const PORT = process.env.PORT || ENV.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});