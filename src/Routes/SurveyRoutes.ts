import moment from "moment";
import { authenticate } from "../Auth/authMiddleware.ts";
import Survey from "../Models/SurveyModel.ts";
import UserModel from "../Models/UserModel.ts";
import IUser from "../Interfaces/IUser.ts";
import ISurvey from "../Interfaces/ISurvey.ts";
import jwt from "jsonwebtoken";
import express from "express";
import SurveyModel from "../Models/SurveyModel.ts";
import mongoose from "mongoose";
const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Get All Surveys`);
    const surveys = await SurveyModel.find();
    res.status(200).json(surveys);
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
    res.status(500).json({ message: e });
  }
});
router.get("/:id", async (req: express.Request, res: express.Response) => {
  const surveyId = req.params.id;
  console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Get Survey: ${surveyId}`);
  try {
    const survey = await SurveyModel.findOne({ _id: surveyId });
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}:${req.method} - Survey ID: ${surveyId}`);

    if (survey) {
      res.status(200).json(survey);
    } else {
      res.status(400).json({ message: "Survey Not Found" });
    }
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
    res.status(500).json({ message: e });
  }
});

export default router;
