import express from "express";
import { verifyOTP, sendOTP } from "../utils/otp";
import prisma from "../configs/prisma";
import { Prisma } from "@prisma/client";
import { hashPassword, verifyPassword } from "../utils/passwordHasher";
import jwt, { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../configs/vars";
import { isAuthenticated } from "../middleware/authMiddleware";

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
      const hashedPassword = hashPassword(email, password);

      const unverifiedUser = await prisma.user.create({
        data: {
          email: email,
          username: username,
          password: hashedPassword,
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

router.post("/resetpassword", async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({
      message: "bad request format",
    });
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    // check if user exists
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    sendOTP(email, "FORGOT");
    res.status(200).json({
      message: "OTP sent sucessfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.post("/resetpassword/verify", async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const newPassword = req.body.password;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      message: "bad request format",
    });
  }

  try {
    // find user
    const user = prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    // verify OTP
    if (verifyOTP(email, "FORGOT", otp)) {
      const hashedPassword = hashPassword(email, newPassword);

      // update password
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: { password: hashedPassword },
      });

      return res.status(200).json({
        message: "password updated",
      });
    } else {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

export default router;
