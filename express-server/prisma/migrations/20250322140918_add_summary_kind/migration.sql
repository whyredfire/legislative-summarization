/*
  Warnings:

  - Added the required column `kind` to the `SummarizationHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SummarizationHistory" ADD COLUMN     "kind" TEXT NOT NULL;
