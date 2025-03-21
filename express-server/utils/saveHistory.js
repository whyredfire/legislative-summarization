import prisma from "../configs/prisma";

export async function saveSummary(userId, text, summary) {
  try {
    const newEntry = await prisma.summarizationHistory.create({
      data: {
        userId: userId,
        inputText: text,
        summary: summary,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
