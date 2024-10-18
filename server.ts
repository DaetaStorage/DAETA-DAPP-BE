import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";

// Load Routes
import users from "./routes/api/users";
import auth from "./routes/api/auth";
import vault from "./routes/api/vault";

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());

// Setup Routes
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/vault", vault);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Root Route of DaeTa back-end!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
