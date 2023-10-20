import { ObjectId } from "mongoose";
import ISurvey from "./ISurvey.ts";
export default interface IUser {
  _id: ObjectId;
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdDate: Date;
  surveys: ISurvey[];
}
