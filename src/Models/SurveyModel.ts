import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
  surveyName: String,
  surveyOwner: String,
  organization: String,
  surveyType: String,
  description: String,
  activeStatus: Boolean,
  dateEnd: Date,
  instructionMessage: String,
  responses: [
    {
      question: String,
      answer: String,
    },
  ],
  questions: [
    {
      questionType: String,
      question: String,
      options: [String],
      correctOption: String,
      imgURL: [String],
      imgDesc: [String],
    },
  ],
});
const Survey = mongoose.model("survey", surveySchema);

export { Survey };
