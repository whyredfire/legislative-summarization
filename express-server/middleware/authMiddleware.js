import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/vars";

export function isAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Access denied",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
}
