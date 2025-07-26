import { generateToken, verifyToken } from "authenticator";
import { MAIL_USER, MAIL_PASS, MAIL_SENDER, OTP_SECRET } from "../configs/vars";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

function getOTP(emailId, type) {
  return generateToken(emailId + type + OTP_SECRET);
}

export function sendOTP(emailId, type) {
  return transporter.sendMail(
    {
      from: MAIL_SENDER,
      to: emailId,
      subject: "Verify your LegalEase account",
      text: `Your OTP is ${getOTP(emailId, type)}`,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      }
    }
  );
}

export function verifyOTP(emailId, type, otp) {
  return verifyToken(emailId + type + OTP_SECRET, otp);
}
