import express from "express";
import { check } from "express-validator";
import {
  registerExtUser,
  saveEarningHistory,
  verifyReferralCode,
} from "../../controllers/extUser";

const router = express.Router();

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  check("wallet", "Please include a valid wallet address").exists(),
  registerExtUser
);
router.post("/verify", verifyReferralCode);
router.post("/earning-history", saveEarningHistory);

export default router;
