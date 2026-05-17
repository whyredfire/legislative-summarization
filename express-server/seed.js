import prisma from "./configs/prisma.js";
import { hashPassword } from "./utils/passwordHasher.js";

const tempUserMail = process.env.TEMP_USER_MAIL;
const tempUserPassword = process.env.TEMP_USER_PASSWORD;

if (tempUserMail && tempUserPassword) {
  const existingUser = await prisma.user.findFirst({
    where: { email: tempUserMail },
  });

  if (!existingUser) {
    const hashedPassword = hashPassword(tempUserMail, tempUserPassword);
    await prisma.user.create({
      data: {
        email: tempUserMail,
        username: "tempuser",
        password: hashedPassword,
        isVerified: true,
      },
    });
    console.log("Temp user created:", tempUserMail);
  } else {
    console.log("Temp user already exists:", tempUserMail);
  }
} else {
  console.log("TEMP_USER_MAIL or TEMP_USER_PASSWORD not set, skipping temp user creation");
}

await prisma.$disconnect();
