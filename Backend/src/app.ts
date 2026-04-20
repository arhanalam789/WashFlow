import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import washingCenterRouter from "./routes/washing-centers";
import requestRouter from "./routes/requests";
import concernRouter from "./routes/concerns";
import notificationRouter from "./routes/notifications";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("WashFlow API running 🚀");
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/washing-centers", washingCenterRouter);
app.use("/api/requests", requestRouter);
app.use("/api/concerns", concernRouter);
app.use("/api/notifications", notificationRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
