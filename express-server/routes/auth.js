import express from "express";
import { verifyOTP, sendOTP } from "../utils/otp";

const router = express.Router();

router.post("/register", async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({
      message: "bad request format",
    });
  }

  try {
    sendOTP(req.body.email, "REGISTER");
    res.status(200).json({
      message: "OTP sent sucessfully",
    });
  } catch (error) {
    console.error("Error registering user: ", error);
    res.send(500).json({
      message: "Internal server error",
      event: "REGISTER",
    });
  }
});

router.post("/register/verify", async (req, res) => {
  if (!req.body.otp || !req.body.email) {
    return res.status(400).json({
      message: "bad request format",
    });
  }

  try {
    if (verifyOTP(req.body.email, "REGISTER", req.body.otp)) {
      res.status(201).json({
        message: "User registered successfully",
      });
    } else {
      res.status(401).json({
        message: "Unauthorized; incorrect OTP",
      });
    }
  } catch (error) {
    console.error("Error verifying user: ", error);
    res.status(500).json({
      message: "Internal server error",
      event: "REGISTER VERIFY",
    });
  }
});

export default router;
