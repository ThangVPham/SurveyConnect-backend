import "dotenv/config";
import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModel.ts";
import express from "express";
async function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  let token = "";
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decodedToken: any = await jwt.verify(token, process.env.JWT_SECRET);
      req.cookies.user = await UserModel.findById({ _id: decodedToken.id });
      next();
    } catch (e) {
      console.log(e);
      res.status(401).json({ message: "Session expired. Please login to continue" });
    }
  }
}

export { authenticate };
