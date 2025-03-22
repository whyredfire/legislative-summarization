import express from "express";
import { verifyOTP, sendOTP } from "../utils/otp";
import prisma from "../configs/prisma";
import { hashPassword, verifyPassword } from "../utils/passwordHasher";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

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
    }

    return res.status(401).json({
      message: "Unauthorized",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.get("/delete", isAuthenticated, async (req, res) => {
  const userId = req.userId;

  try {
    const userToDelete = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    sendOTP(userToDelete.email, "DELETE");

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.post("/delete/verify", isAuthenticated, async (req, res) => {
  const userId = req.userId;
  const otp = req.body.otp;

  try {
    const userToDelete = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    // delete user on verification
    if (verifyOTP(userToDelete.email, "DELETE", otp)) {
      const deleteUser = await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return res.status(200).json({
        message: "user deleted",
      });
    }

    return res.status(401).json({
      message: "Unauthorized",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

export default router;
