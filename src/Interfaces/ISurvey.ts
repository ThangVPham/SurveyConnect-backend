import { ObjectId } from "mongoose";

export default interface ISurvey {
  _id: ObjectId;
  surveyName: string;
  surveyOwner: string;
  organization: { type: string; default: "" };
  surveyType: string;
  description: string;
  activeStatus: boolean;
  dateEnd: string;
  instructionMessage: string;
  responses: Response[] | null;
  questions: Question[];
}

interface Response {
  question: string;
  answer: string;
}
interface Question {
  id: number;
  questionType: string;
  question: string;
  options: string[];
  correctOption: string | null;
  imgURL: string[] | null;
  imgDesc: string[] | null;
}
