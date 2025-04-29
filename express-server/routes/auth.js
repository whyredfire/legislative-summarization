import express from "express";
import { verifyOTP, sendOTP } from "../utils/otp";
import prisma from "../configs/prisma";
import { Prisma } from "@prisma/client";
import { hashPassword, verifyPassword } from "../utils/passwordHasher";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/vars";

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

    // return if user is verified
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = hashPassword(email, password);

    // create unverified user
    const unverifiedUser = await prisma.user.upsert({
      where: { email },
      update: {
        username,
        password: hashedPassword,
        isVerified: false,
      },
      create: {
        email,
        username,
        password: hashedPassword,
        isVerified: false,
      },
    });

    sendOTP(email, "REGISTER");
    const encodedUserId = btoa(unverifiedUser.id);

    res.status(200).json({
      message: "OTP sent sucessfully",
      uniqueId: encodedUserId,
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

router.post("/register/resend", async (req, res) => {
  const userId = req.body.uniqueId;

  if (!userId) {
    return res.status(400).json({
      message: "bad request format",
    });
  }

  try {
    const decodedUserId = atob(userId);

    const unverifiedUser = await prisma.user.findFirst({
      where: {
        id: decodedUserId,
      },
    });

    // check if user is verified
    if (unverifiedUser.isVerified) {
      return res.status(400).json({
        message: "user already verified",
      });
    }

    sendOTP(unverifiedUser.email, "REGISTER");

    res.status(200).json({
      message: "OTP re-sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.post("/register/verify", async (req, res) => {
  const userId = req.body.uniqueId;
  const otp = req.body.otp;

  // validate body data
  if (!userId || !otp) {
    return res.status(400).json({
      message: "bad request format",
    });
  }

  try {
    const decodedUserId = atob(userId);

    const user = await prisma.user.findFirst({
      where: { id: decodedUserId },
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
    if (verifyOTP(user.email, "REGISTER", otp)) {
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
    console.error("Error verifying registered user: ", error);
    res.status(500).json({
      message: "Internal server error",
      event: "REGISTER VERIFY",
    });
  }
});

router.post("/login", async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  // validate body
  if (!login || !password) {
    return res.status(400).json({
      message: "bad request format",
    });
  }

  try {
    // check if login is username or email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: isEmail ? login : undefined },
          { username: !isEmail ? login : undefined },
        ],
      },
    });

    // check if user exists
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      }); // check if user is verified
    } else if (!user.isVerified) {
      return res.status(401).json({
        message: "unauthorized access",
      });
    }

    // validate password
    if (verifyPassword(user.email, password, user.password)) {
      // set cookies
      const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
      });

      const userInfo = btoa(`${user.username}, ${user.email}`);

      res
        .cookie("token", jwtToken, { maxAge: 7 * 24 * 60 * 60 * 1000 }) // 7 days
        .cookie("data", userInfo, { maxAge: 7 * 24 * 60 * 60 * 1000 }) // 7 days
        .status(200)
        .json({ message: "user logged in" });
    } else {
      res.status(401).json({
        message: "authentication failed",
      });
    }
  } catch (error) {
    console.error("Error logging in user: ", error);
    res.status(500).json({
      message: "Internal server error",
      event: "LOGIN",
    });
  }
});

export default router;
