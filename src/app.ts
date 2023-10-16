import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import ConnectToDb from "./DbConfig/DbConnection.ts";
import SurveyRoutes from "./Routes/SurveyRoutes.ts";
import UserRoutes from "./Routes/UserRoutes.ts";
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  ConnectToDb();
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/surveys", SurveyRoutes);
app.use("/api/user", UserRoutes);
