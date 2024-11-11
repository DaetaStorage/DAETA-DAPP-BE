import { Request, Response } from "express";
import FileManager from "file-manager";
import bcrypt from "bcryptjs";
import Path from "path";
import http from "http";
import fs from "fs";

// Load Models
import { Vault } from "../models/Vault";
import { User } from "../models/User";
import download from "download";

const manager = new FileManager(Path.join(__dirname, "storage"));

export const readFiles = async () => {
  const files = await manager.readFiles(["1.txt", "2.txt"]);
  console.log({ files });
};

export const createVault = async (req: any, res: Response) => {
  const name = req.body.name;
  const passcode = req.body.passcode;

  if (!name || !passcode)
    return res.status(400).json({ msg: "Name and Passcode are required" });

  try {
    const salt = await bcrypt.genSalt(10);

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    const vault = await Vault.create({
      name,
      path: req.user.id,
      passcode: await bcrypt.hash(passcode, salt),
    });

    user.vaults.unshift({ vault: vault._id });

    await user.save();

    return res.status(200).json({ msg: "Vault created successfully" });
  } catch (error) {
    console.log("Internal Server error during creating a vault", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const verifyVault = async (req: any, res: Response) => {
  const id = req.body.id;
  const passcode = req.body.passcode;

  if (!id || !passcode)
    return res.status(400).json({ msg: "Passcode is required" });

  try {
    const vault = await Vault.findById(id);

    if (!vault) {
      return res.status(400).json({ errors: [{ msg: "Vault not found" }] });
    }

    const isMatch = await bcrypt.compare(passcode, vault.passcode);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    return res.status(200).json({ msg: "Valid Vault" });
  } catch (error) {
    console.log("Internal Server error during verifying a vault", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const uploadFiles = async (req: any, res: Response) => {
  const id = req.body.id;
  const files = req.files;

  if (!id || !files)
    return res.status(400).json("Vault ID and Files are not sent");

  try {
    const vault = await Vault.findById(id);

    if (!vault) return res.status(404).json({ msg: "Vault Not Found" });

    for (let i = 0; i < files.length; i++) {
      const obj = {
        name: files[i].filename,
        origin: files[i].originalname,
        destination: files[i].destination,
        size: files[i].size,
      };

      vault.files.push(obj);
    }

    await vault.save();

    return res.status(200).json({ msg: "File Uploaded" });
  } catch (error) {
    console.log("Internal Server error during uploading files", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const downloadFile = async (req: any, res: Response) => {
  const vaultId = req.body.vault_id;
  const fileId = req.body.file_id;

  if (!fileId || !vaultId)
    return res.status(400).json({ msg: "Bad request: No file id was sent" });

  try {
    const vault = await Vault.findById(vaultId);

    if (!vault) return res.status(404).json({ msg: "Vault is not found" });

    const files = vault.files;
    const fileToDownload = files.filter((file) => file._id == fileId);

    if (!fileToDownload || fileToDownload.length === 0)
      return res.status(404).json({ msg: "File is not found" });

    const file = `storage/${fileToDownload[0].name}`;
    return res.status(200).download(file);
  } catch (error) {
    console.log("Internal server error during downloading file: ", error);
    return res.status(500).json(error);
  }
};
