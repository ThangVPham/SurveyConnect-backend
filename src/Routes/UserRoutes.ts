import express from "express";
import {
  RegisterUser,
  Login,
  GetUserSurveys,
  GetUserSingleSurveyById,
  CreateNewSurvey,
  DeleteUserSurvey,
} from "../Controllers/UserController.ts";
import { authenticate } from "../Auth/authMiddleware.ts";

const router = express.Router();
router.post("/login", Login);
router.post("/register", RegisterUser);
router.get("/surveys", authenticate, GetUserSurveys);
router.get("/surveys/:id", authenticate, GetUserSingleSurveyById);
router.post("/surveys", authenticate, CreateNewSurvey);
router.delete("/surveys/:id", authenticate, DeleteUserSurvey);
export default router;
