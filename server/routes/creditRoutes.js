import express from "express";

import {
  getPlans,
  purchasePlan
} from "../controllers/creditController.js";

import { protect } from "../middleware/auth.js";

const creditRouter = express.Router();

// get all plans
creditRouter.get("/plans", getPlans);

// purchase a plan
creditRouter.post("/purchase", protect, purchasePlan);


export default creditRouter;