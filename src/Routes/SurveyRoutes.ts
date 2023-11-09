import express from "express";
import { GetPublicSurvey, GetSinglePublicSurveyById, PostNewPublicSurvey } from "../Controllers/SurveyController.ts";

const router = express.Router();

router.get("/", GetPublicSurvey);
router.get("/:id", GetSinglePublicSurveyById);
router.post("/:id", PostNewPublicSurvey);
export default router;
