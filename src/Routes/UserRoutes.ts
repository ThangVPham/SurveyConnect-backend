import express from "express";
import jwt from "jsonwebtoken";
import { RegisterUser, Login } from "../Controllers/UserController.ts";
import UserModel from "../Models/UserModel.ts";
import IUser from "../Interfaces/IUser.ts";
import moment from "moment";
import { authenticate } from "../Auth/authMiddleware.ts";
import ISurvey from "../Interfaces/ISurvey.ts";
import SurveyModel from "../Models/SurveyModel.ts";

const router = express.Router();

router.post("/login", Login);
router.post("/register", RegisterUser);
router.get("/surveys", authenticate, async (req: express.Request, res: express.Response) => {
  console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}:${req.method} - Get All User's Surveys`);
  try {
    const user: IUser = req.cookies.user;
    if (user) {
      console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}:${req.method} - User Found: ${user._id}`);
    }
    res.status(200).json(user.surveys);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
});
router.get("/surveys/:id", authenticate, async (req: express.Request, res: express.Response) => {
  try {
    const surveyId = req.params.id;
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Getting User Survey By ID`);
    const user: IUser = req.cookies.user;
    const survey = user.surveys.find((survey) => survey._id.toString() === surveyId);
    if (survey) {
      res.status(200).json(survey);
    }
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - ${e}`);
    res.status(500).json({ message: e });
  }
});

router.post("/surveys", authenticate, async (req: express.Request, res: express.Response) => {
  console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Uploading User Surveys`);
  const user: IUser = req.cookies.user;
  const newSurvey: ISurvey = req.body;

  try {
    await SurveyModel.create(req.body);
    const addedSurvey = await SurveyModel.findOne({ surveyName: newSurvey.surveyName });
    newSurvey._id = addedSurvey._id;
    const updatedUserSurveyList = [...user.surveys, newSurvey];

    await UserModel.findOneAndUpdate({ email: user.email }, { surveys: updatedUserSurveyList });
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - User New Surveys Added`);
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - New survey added to Survey DB`);
    res.status(200).json({ message: "User Surveys Updated" });
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
  }
});

router.delete("/surveys/:id", async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Delete Survey: ${id}`);
  try {
    const survey = await SurveyModel.deleteOne({ _id: id });
    res.status(200).json({ message: `Survey ${id} deleted` });
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
    res.status(500).json({ message: e });
  }
});
export default router;
