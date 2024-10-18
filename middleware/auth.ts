import passportJwt from "passport-jwt";
import mongoose from "mongoose";
import { secretOrKey } from "../config/keys";
import jwt from "jsonwebtoken";

const User = mongoose.model("users");
const jwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

interface jwtOpts {
  jwtFromRequest: any;
  secretOrKey: string;
}

const opts: jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey,
};

const passport = (passport: any) => {
  passport.use(
    new jwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err: any) => console.log(err));
    })
  );
};

// export default passport;

export default function (req: any, res: any, next: any) {
  // Get token from header
  const token = req.header("Authorization");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    jwt.verify(token, secretOrKey, (error: any, decoded: any) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
}
