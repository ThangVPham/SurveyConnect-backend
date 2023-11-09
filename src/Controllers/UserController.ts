import "dotenv/config";
import moment from "moment";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import SurveyModel from "../Models/SurveyModel.ts";
import UserModel from "../Models/UserModel.ts";
import IUser from "../Interfaces/IUser.ts";
import ISurvey from "../Interfaces/ISurvey.ts";

async function RegisterUser(req: express.Request, res: express.Response) {
  console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Register User`);
  const { email, password } = req.body;

  const checkCondition = email && password;

  if (!checkCondition) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: Registration failed. Email and/or password invalid.`);
    res.status(400).json({ message: "Registration failed. Please make sure all required fields are filled" });
  } else {
    try {
      const userExists = await UserModel.findOne({ email });
      if (userExists) {
        console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: Email has already been registered.`);
        res.status(400).json({ message: "Email has already been registered. Please sign in to continue" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await UserModel.create({
          email,
          password: hashedPassword,
        });
        console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: User successfully registered`);
        res.status(200).json({
          token: GenerateToken(newUser._id.toString()),
          message: "User successfully registered",
          statusCode: 201,
        });
      }
    } catch (e) {
      console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
    }
  }
}

async function Login(req: express.Request, res: express.Response) {
  console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Login User`);
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: User ${user.email} - Login Successful`);
    res.status(200).json({
      token: GenerateToken(user._id.toString()),
      message: "Login Successful.",
    });
  } else {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: Invalid password/email.`);
    res.status(400).json({ message: "Invalid password/email. Please try again." });
  }
}

function GenerateToken(id: string) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1w",
  });
  return token;
}

async function GetUserSurveys(req: express.Request, res: express.Response) {
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
}

async function GetUserSingleSurveyById(req: express.Request, res: express.Response) {
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
}

async function CreateNewSurvey(req: express.Request, res: express.Response) {
  console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Uploading User Surveys`);
  const user: IUser = req.cookies.user;
  const newSurvey: ISurvey = req.body;
  newSurvey.surveyOwner = user._id.toString();

  try {
    await SurveyModel.create(newSurvey);
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
}
async function DeleteUserSurvey(req: express.Request, res: express.Response) {
  const id = req.params.id;
  const user: IUser = req.cookies.user;

  console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${req.method} - Delete Survey: ${id}`);
  try {
    await SurveyModel.deleteOne({ _id: id });
    const surveyIndex = user.surveys.findIndex((survey) => survey._id.toString() === id);
    user.surveys.splice(surveyIndex, 1);
    await UserModel.updateOne({ _id: user._id }, user);
    res.status(200).json({ message: `Survey ${id} deleted` });
  } catch (e) {
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: ${e}`);
    res.status(500).json({ message: e });
  }
}
export { RegisterUser, Login, GetUserSurveys, GetUserSingleSurveyById, CreateNewSurvey, DeleteUserSurvey };
