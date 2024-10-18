import express from "express";
import multer from "multer";
import path from "path";

import auth from "../../middleware/auth";
import {
  createVault,
  downloadFile,
  uploadFiles,
  verifyVault,
} from "../../controllers/vault";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./storage"); // Replace with your desired destination
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post("/", auth, createVault);

router.post("/auth", auth, verifyVault);

router.post("/upload", upload.array("files[]"), auth, uploadFiles);

router.post("/download", auth, downloadFile);

export default router;
