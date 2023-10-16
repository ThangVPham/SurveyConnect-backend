import moment from "moment";
import { authenticate } from "../Auth/authMiddleware.ts";
import { Survey } from "../Models/SurveyModel.ts";
import UserModel from "../Models/UserModel.ts";
import IUser from "../Interfaces/IUser.ts";
import ISurvey from "../Interfaces/ISurvey.ts";

import express from "express";
const router = express.Router();
const date = new Date();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Get All Surveys`);
    const allSurveys = await Survey.find();
    res.json(allSurveys);
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
    res.status(500).json({ message: e });
  }
});
router.get("/:id", async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Get Survey: ${id}`);
  try {
    const survey = await Survey.findOne({ _id: id });
    console.log(`${req.method} - Survey ID: ${id}`);
    res.json(survey);
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
    res.status(500).json({ message: e });
  }
});
router.delete("/:id", async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Delete Survey: ${id}`);
  try {
    const survey = await Survey.deleteOne({ _id: id });
    res.status(200).json({ message: `Survey ${id} deleted` });
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
    res.status(500).json({ message: e });
  }
});

router.post("/", authenticate, async (req: express.Request, res: express.Response) => {
  console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Uploading User Surveys`);
  const user: IUser = req.cookies.user;

  const newSurvey: ISurvey = req.body;
  const updatedUserSurveyList = [...user.surveys];
  updatedUserSurveyList.push(newSurvey);
  // console.log(updatedUserSurveyList);
  try {
    await UserModel.findOneAndUpdate({ email: user.email }, { surveys: updatedUserSurveyList });
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: User Surveys Updated`);
    res.status(200).json({ message: "User Surveys Updated" });
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
  }
});

export default router;
