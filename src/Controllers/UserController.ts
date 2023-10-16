import "dotenv/config";
import moment from "moment";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../Models/UserModel.ts";

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
    console.log(`${moment().format("MMMM Do YYYY, h:mm:ss a")}: Login Successful`);
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

export { RegisterUser, Login };
