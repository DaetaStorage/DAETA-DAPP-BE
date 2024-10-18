import express from "express";
import { check } from "express-validator";

// Load Controller
import {
  getUser,
  loginUser,
  loginWithGoogle,
  loginWithMetaMask,
} from "../../controllers/auth";

// Load Middleware
import auth from "../../middleware/auth";

const router = express.Router();

// @route    GET api/auth
// @desc     Get user by auth
// @access   Private
router.get("/", auth, getUser);

// @route    POST api/auth
// @desc     Authenticate user and get token
router.post(
  "/",
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
  loginUser
);

// @route    POST api/auth/google-auth
// @desc     Login or Register an user with Google OAuth
// @access   Public
router.post("/google-auth", loginWithGoogle);

// @route    POST api/auth/wallet-auth
// @desc     Login or Register an user with MetaMask
// @access   Public
router.post("/wallet-auth", loginWithMetaMask);

export default router;
