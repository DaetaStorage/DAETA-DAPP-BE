import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import clientJson from "../config/client.json";
import axios from "axios";

// Google Auth
import { OAuth2Client } from "google-auth-library";
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;
const client = new OAuth2Client(clientJson.web);

// Load Model
import { User } from "../models/User";
import { secretOrKey } from "../config/keys";

export const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "User not found" }] });
    }

    if (!user.password)
      return res
        .status(400)
        .json({ errors: [{ msg: "Password is not provided" }] });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      return res.status(200).json({ token });
    });
  } catch (error) {
    console.log("Internal server error during logging", error);
    res.status(500).json("Server Error");
  }
};

export const loginWithGoogle = async (req: any, res: any) => {
  const email = req.body.email;
  const username = req.body.username;

  if (!email || !username)
    return res
      .status(400)
      .json({ msg: "Bad request: Google Login credentials were not sent" });

  try {
    // const response = await axios.post("https://oauth2.googleapis.com/token", {
    //   code: credential,
    //   client_id: clientId,
    //   client_secret: clientSecret,
    //   redirect_uri: redirectUri,
    //   grant_type: "authorization_code",
    // });

    // const idToken = response.data.id_token;
    // const { tokens } = await client.getToken(credential);
    // if (!tokens.id_token)
    //   return res.status(500).json({ msg: "Internal server error" });

    // const ticket = await client.verifyIdToken({
    //   idToken: idToken,
    //   audience: clientId,
    // });

    // const payload = ticket.getPayload();
    // if (!payload) return res.status(500).json({ msg: "Login Failed" });

    // const email = payload.email;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username,
        email,
        password: "daeta123",
        loginWith: "google",
      });
    }

    // Generate a JWT Token
    const payload_ = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(payload_, secretOrKey, { expiresIn: 3600 }, (err, token) => {
      if (err) return res.status(500).json({ msg: "Internal server error" });

      res.status(200).json({ token });
    });
  } catch (error) {
    console.log("Internal server error during logging with Google: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const loginWithMetaMask = async (req: any, res: any) => {
  const address = req.body.address;

  if (!address)
    return res
      .status(400)
      .json({ msg: "Bad request: Address doesn't exist!!!" });

  try {
    let user = await User.findOne({ wallet: address });

    if (!user) {
      user = await User.create({ wallet: address, loginWith: "wallet" });
    }

    const payload_ = {
      user: {
        id: user._id,
      },
    };
    jwt.sign(payload_, secretOrKey, { expiresIn: 3600 }, (err, token) => {
      if (err) return res.status(500).json({ msg: "Internal server error" });

      res.status(200).json({ token });
    });
  } catch (error) {
    console.log("Internal server error during logging with MetaMask: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const getUser = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("vaults.vault");

    return res.status(200).json(user);
  } catch (error) {
    console.log("Internal server error during getting an user", error);
    res.status(500).json("Server Error");
  }
};
