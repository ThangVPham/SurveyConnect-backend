export default interface ISurvey {
  surveyName: string;
  surveyOwner: string;
  organization: string;
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
  questionType: string;
  question: string;
  options: string[];
  correctOption: string | null;
  imgURL: string[] | null;
  imgDesc: string[] | null;
}
