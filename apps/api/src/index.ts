import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "bun";
import weatherRoutes from "./routes/weather.route";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config({
  path: fileURLToPath(new URL("../../../.env", import.meta.url)),
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); // url front-end
app.use(express.json());

// Routes
app.use("/api/weather", weatherRoutes);

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
