import ISurvey from "./ISurvey.ts";
export default interface IUser {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdDate: Date;
  surveys: ISurvey[];
}
