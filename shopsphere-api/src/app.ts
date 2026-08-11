import express from "express";
import cors from "cors";
import helmet from "helmet";



import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import addressRoutes from "./routes/address.routes";
import categoryRoutes from "./routes/category.routes";
import reviewRoutes from "./routes/review.routes";
import paymentRoutes from "./routes/payment.routes";

import { errorHandler } from "./middleware/error.middleware";


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);




app.get("/test", (_req, res) => {
  res.json({ message: "THIS APP IS RUNNING" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "ShopSphere API is running",
  });
});

app.use(errorHandler);

export default app;