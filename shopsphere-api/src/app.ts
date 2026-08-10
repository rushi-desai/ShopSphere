import express from "express";
import cors from "cors";
import helmet from "helmet";
import productRoutes from "./routes/product.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

app.get("/test", (_req, res) => {
  res.json({ message: "THIS APP IS RUNNING" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "ShopSphere API is running",
  });
});

export default app;