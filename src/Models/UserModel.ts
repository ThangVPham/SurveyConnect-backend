import IUser from "Interfaces/IUser.ts";
import mongoose, { SchemaType } from "mongoose";
const UserSchema = new mongoose.Schema<IUser>({
  userName: { type: String, default: "User" },
  email: String,
  password: String,
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  createdDate: { type: Date, default: Date.now() },
  surveys: {
    type: [
      {
        surveyName: String,
        surveyOwner: { type: String, default: "" },
        organization: String,
        surveyType: String,
        description: { type: String, default: "" },
        activeStatus: { type: Boolean, default: true },
        dateEnd: { type: Date, default: Date.now() },
        instructionMessage: { type: String, default: "" },
        responses: {
          type: [
            [
              {
                question: String,
                answer: [String],
              },
            ],
          ],
          default: [],
        },
        questions: {
          type: [
            {
              id: { type: Number },
              questionType: { type: String, default: "" },
              question: { type: String, default: "" },
              options: { type: [String], default: [] },
              correctOption: { type: String, default: "" },
              imgURL: { type: [String], default: [] },
              imgDesc: { type: [String], default: [] },
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  },
});

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;
