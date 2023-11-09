import moment from "moment";
import UserModel from "../Models/UserModel.ts";
import IUser from "../Interfaces/IUser.ts";
import ISurvey from "../Interfaces/ISurvey.ts";
import express from "express";
import SurveyModel from "../Models/SurveyModel.ts";
async function GetPublicSurvey(req: express.Request, res: express.Response) {
  try {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Get All Surveys`);
    const surveys = await SurveyModel.find();
    res.status(200).json(surveys);
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
    res.status(500).json({ message: e });
  }
}
async function GetSinglePublicSurveyById(req: express.Request, res: express.Response) {
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
}
async function PostNewPublicSurvey(req: express.Request, res: express.Response) {
  const surveyId = req.params.id;
  const userId = req.headers.userid;
  try {
    const user: IUser = await UserModel.findById({ _id: userId });
    const survey: ISurvey = user.surveys.find((survey) => survey._id.toString() === surveyId);
    survey.responses.push(req.body);

    await UserModel.updateOne({ _id: userId }, user);
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Survey Responses Updated`);
    res.status(200).json({ message: "Survey Response Posted" });
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
    res.status(500).json({ message: e });
  }
}

export { GetPublicSurvey, GetSinglePublicSurveyById, PostNewPublicSurvey };
