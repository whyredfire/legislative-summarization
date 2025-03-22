import prisma from "../configs/prisma";

export async function saveSummary(userId, kind, text, summary) {
  try {
    const newEntry = await prisma.summarizationHistory.create({
      data: {
        userId: userId,
        kind: kind,
        inputText: text,
        summary: summary,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
