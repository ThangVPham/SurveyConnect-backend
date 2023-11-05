import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import ConnectToDb from "./DbConfig/DbConnection.ts";
import SurveyRoutes from "./Routes/SurveyRoutes.ts";
import UserRoutes from "./Routes/UserRoutes.ts";
import moment from "moment";
import axios from "axios";

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
app.use("/", (req: express.Request, res: express.Response) => {
  res.json({
    message:
      "Thanks for checking us out. Please make sure you're using the correct API endpoints when requesting data.",
  });
});
const survey_url = "https://surveyconnect-backend.onrender.com/api/surveys";
const id = setInterval(() => {
  WakeServer();
}, 840000);
async function WakeServer() {
  try {
    const survey_res = await axios.get(survey_url);
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")} - Survey Connect Pinged`);
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")} - ${e}`);
  }
}
