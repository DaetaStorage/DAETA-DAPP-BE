import { Request, Response } from "express";

import mongoose from "mongoose";

// middleware to check for a valid object Id
const checkObjectId =
  (idToCheck: string) => (req: Request, res: Response, next: any) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))
      return res.status(400).json({ msg: "Invalid ID" });

    next();
  };
