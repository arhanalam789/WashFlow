import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("WashFlow API running 🚀");
});

export default app;