import express from "express";
import cors from "cors";
import transactionsRoutes from "./src/routes/transactionsRoute.js";


const app = express();

// ✅ CORS MUST be before routes
app.use(
  cors({
    origin: "http://localhost:8081", // Expo Web
    credentials: true,
  })
);

app.use(express.json());

// routes
app.use("/api/transactions", transactionsRoutes);

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
