import crypto from "crypto";
import { HASH_SALT } from "../configs/vars";

export function hashPassword(email, password) {
  return crypto
    .scryptSync(password.normalize(), email + HASH_SALT, 64)
    .toString("hex");
}

export function verifyPassword(email, password, hashedpassword) {
  return hashPassword(email, password) === hashedpassword;
}
