import { Request, Response } from "express";
import { validationResult } from "express-validator";
import rs from "randomstring";
import { ExtUser } from "../models/ExtUser";
import { refEarningRate, refRewards } from "../config/constants";
import { Referral } from "../models/Referral";
import { History } from "../models/History";
import { Conversation } from "../models/Conversations";

export const registerExtUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { wallet } = req.body;
  const invite_code = rs.generate(8);

  try {
    const user = await ExtUser.findOne({ wallet });

    if (user) {
      // Already exist
      const histories = await History.find({ user: user._id });
      const referrals = await Referral.find({ inviter: user._id });

      const userInfo = {
        ...user,
        histories,
        referrals,
      };

      return res.status(200).json(userInfo);
    } else {
      // Create
      // General Register
      const user = await ExtUser.create({
        wallet,
        code: invite_code,
      });

      const userInfo = {
        ...user,
        histories: null,
        referrals: null,
      };

      return res.status(200).json(userInfo);
    }
  } catch (error) {
    console.log(
      "Internal server error during registering extension user: ",
      error
    );
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const verifyReferralCode = async (req: Request, res: Response) => {
  const { wallet, refCode, isSkipped } = req.body;

  if (!wallet) {
    return res.status(400).json({ msg: "Internal server error" });
  }

  try {
    const user = await ExtUser.findOne({ wallet });

    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.code == refCode)
      return res.status(400).json({ msg: "Invalid referral code" });

    if (isSkipped) {
      // Skipped
      user.isSkipped = true;
      await user.save();

      return res.status(200).json(user);
    } else {
      // Refferal
      const refUser = await ExtUser.findOne({ code: refCode });

      if (!refUser)
        return res.status(404).json({ msg: "Referral code is incorrect" });

      user.refCode = refCode;
      await user.save();

      return res.status(200).json(user);
    }
  } catch (error) {
    console.error(
      "Internal server error during verifying the referral code: ",
      error
    );
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const saveEarningHistory = async (req: Request, res: Response) => {
  const { wallet, items, reward, conversations } = req.body;

  if (!wallet || !items || !reward || !conversations)
    return res
      .status(400)
      .json({ status: "failed", msg: "Bad request: data is missing" });

  try {
    const user = await ExtUser.findOne({ wallet });

    if (!user) return res.status(404).json({ msg: "User not found" });

    let conv_cnt = 0;
    if (conversations.length > 0) {
      await Promise.all(
        conversations.map(async (item: any) => {
          const temp = await Conversation.findOne({ conversation_id: item.id });
          if (!temp) {
            user.conversations.push({
              id: item.id,
              title: item.title,
              description: item.description,
            });

            await Conversation.create({
              user: user._id,
              conversation_id: item.id,
            });

            conv_cnt++;
          }
        })
      );
    }

    user.rewards += conv_cnt;
    user.points += conv_cnt;
    user.items += conv_cnt;

    await History.create({
      user: user._id,
      items: conv_cnt,
      reward: conv_cnt,
    });

    await user.save();

    const inviter = await ExtUser.findOne({ code: user.refCode });
    if (inviter) {
      inviter.points += conv_cnt * refEarningRate;
      await inviter.save();

      await Referral.create({
        inviter: inviter._id,
        invitee: user._id,
        reward: conv_cnt * refEarningRate,
      });
    }

    return res.status(200).json({ count: conv_cnt });
  } catch (error) {
    console.error(
      "Internal server error during saving earning history: ",
      error
    );
    return res.status(500).json({ msg: "Internal server error" });
  }
};
