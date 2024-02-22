import bodyParser from "body-parser";
import express from "express";
import botRouter from "./router/bot";
import morgan from "morgan";
import cors from "cors";
import { tokenGuard } from "./auth/auth.guard";
const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "100kb" }));
app.use(bodyParser.urlencoded({ limit: "100kb", extended: false }));

// guard
app.use(tokenGuard);

// routers
app.use("/", botRouter);

export default app;
