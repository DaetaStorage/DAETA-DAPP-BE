import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Load Model
import { User } from "../models/User";

// Load Consts
import { secretOrKey } from "../config/keys";

export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    const salt = await bcrypt.genSalt(10);
    const createdUser = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, salt),
      loginWith: "email",
    });

    const payload = {
      user: {
        id: createdUser._id,
      },
    };

    jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
  } catch (error) {
    console.error("Internal server error during user registration: ", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
