import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import washingCenterRouter from "./routes/washing-centers";
import requestRouter from "./routes/requests";
import concernRouter from "./routes/concerns";
import notificationRouter from "./routes/notifications";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";

const app: Application = express();
const configuredOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];

const allowedOrigins = new Set([
  "https://washflow.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...configuredOrigins,
]);

const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);
    return hostname === "washflow.vercel.app" || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin: string | undefined, callback: (error: Error | null, success?: boolean) => void) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(cors(corsOptions));
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
