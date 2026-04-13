import { Router } from "express";
import { getCountryWeather } from "../controllers/weather.controller";

const router = Router();

router.get("/:country", getCountryWeather);

export default router;
