-- DropForeignKey
ALTER TABLE "SummarizationHistory" DROP CONSTRAINT "SummarizationHistory_userId_fkey";

-- AddForeignKey
ALTER TABLE "SummarizationHistory" ADD CONSTRAINT "SummarizationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
