import ISurvey from "Interfaces/ISurvey.ts";
import mongoose from "mongoose";

const surveySchema = new mongoose.Schema<ISurvey>({
  surveyName: String,
  surveyOwner: String,
  organization: String,
  surveyType: String,
  description: String,
  activeStatus: Boolean,
  dateEnd: Date,
  instructionMessage: String,
  responses: {
    type: [
      {
        question: String,
        answer: String,
      },
    ],
    default: [],
  },
  questions: [
    {
      questionType: String,
      id: Number,
      question: String,
      options: [String],
      correctOption: String,
      imgURL: [String],
      imgDesc: [String],
    },
  ],
});
const Survey = mongoose.model("survey", surveySchema);

export default Survey;
