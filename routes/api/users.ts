import express from "express";
import { check } from "express-validator";
import { registerUser } from "../../controllers/users";

const router = express.Router();

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  registerUser
);

export default router;
