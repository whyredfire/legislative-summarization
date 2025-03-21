import express from "express";
import { verifyOTP, sendOTP } from "../utils/otp";
import prisma from "../configs/prisma";
import { Prisma } from "@prisma/client";

const router = express.Router();

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (!email || !username || !password) {
    return res.status(400).json({
      message: "bad request format",
    });
  }

  try {
    // check if user exists with email
    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });

    // create unverified user
    if (!existingUser) {
      // check if email is unique
      const unverifiedUser = await prisma.user.create({
        data: {
          email: email,
          username: username,
          password: password,
          isVerified: false,
        },
      });
    } // check if existing user is verified
    else if (existingUser.isVerified) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // send OTP
    sendOTP(email, "REGISTER");
    res.status(200).json({
      message: "OTP sent sucessfully",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002" && error.meta?.target) {
        const duplicateField = error.meta.target.join(", ");
        return res.status(400).json({
          message: `Duplicate value for: ${duplicateField}`,
        });
      }
    }
    console.error("Error registering user: ", error);
    res.send(500).json({
      message: "Internal server error",
      event: "REGISTER",
    });
  }
});

router.post("/register/verify", async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  // validate body data
  if (!email || !otp) {
    return res.status(400).json({
      message: "bad request format",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    // check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // check if user is authorized
    if (user.isVerified) {
      return res.status(409).json({
        message: "User already authorized",
      });
    }

    // verify OTP
    if (verifyOTP(email, "REGISTER", otp)) {
      // set isVerified to true
      const verifiedUser = await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });

      res.status(201).json({
        message: "User registered successfully",
      });
    } else {
      res.status(401).json({
        message: "Unauthorized; incorrect OTP",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      event: "REGISTER VERIFY",
    });
  }
});

export default router;
