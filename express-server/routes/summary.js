import express from "express";
import { FASTAPI_SERVER } from "../configs/vars";
import { isAuthenticated } from "../middleware/authMiddleware";
import { saveSummary } from "../utils/saveHistory";
import prisma from "../configs/prisma";
import fs from "fs";
import PDFDocument from "pdfkit";
import { addSummaryDetails } from "../utils/externalApi";
import path from "path";

const router = express.Router();

router.post("/extractive", isAuthenticated, async (req, res) => {
  const text = req.body.text;
  const isIncognito = req.body.isIncognito;

  if (!text) {
    return res.status(400).json({
      message: "bad message format",
    });
  }

  try {
    const response = await fetch(`${FASTAPI_SERVER}/api/summary/extractive`, {
      method: "POST",
      body: JSON.stringify({
        text: req.body.text,
      }),
    });

    const data = await response.json();

    if (!isIncognito) {
      // save summary to db
      saveSummary(req.userId, "extractive", text, data.summary);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/abstractive", isAuthenticated, async (req, res) => {
  const text = req.body.text;
  const isIncognito = req.body.isIncognito;

  if (!text) {
    return res.status(400).json({
      message: "bad message format",
    });
  }

  try {
    const response = await fetch(`${FASTAPI_SERVER}/api/summary/abstractive`, {
      method: "POST",
      body: JSON.stringify({
        text: req.body.text,
      }),
    });

    const data = await response.json();

    if (!isIncognito) {
      // save summary to db
      saveSummary(req.userId, "abstractive", text, data.summary);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/history", isAuthenticated, async (req, res) => {
  const count = req.query.count;

  try {
    const results = await prisma.summarizationHistory.findMany({
      where: {
        userId: req.userId,
      },
      take: parseInt(count),
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        kind: true,
        inputText: true,
        summary: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.delete(
  "/history/delete/:summary_id",
  isAuthenticated,
  async (req, res) => {
    try {
      const deleted_summary = await prisma.summarizationHistory.delete({
        where: {
          userId: req.userId,
          id: req.params.summary_id,
        },
      });

      res.send(200).json({
        message: "summary deleted",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

router.post("/export/pdf", isAuthenticated, async (req, res) => {
  const text = req.body.text;
  const summary = req.body.summary;
  let outputPath = null;

  if (!text || !summary) {
    return res.status(400).json({
      message: "bad request format",
    });
  }

  try {
    const caseData = await addSummaryDetails(text, summary);

    if (!caseData || typeof caseData !== "object") {
      console.error("Failed to generate data for PDF generation");
      return res
        .status(500)
        .json({ message: "Failed to process data for PDF generation" });
    }

    const fileName = "LegalEase_summary";
    outputPath = path.join(process.cwd(), fileName);

    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
      bufferPages: true,
    });

    await new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(outputPath);

      stream.on("finish", () => {
        resolve();
      });
      stream.on("error", (error) => {
        console.error(`Error writing PDF file stream to ${outputPath}:`, error);
        reject(error);
      });

      doc.pipe(stream);

      // header
      doc
        .fontSize(10)
        .fillColor("gray")
        .text("LegalEase - https://legalease.whyredfire.tech", {
          align: "center",
          underline: false,
        })
        .fillColor("black");
      doc.moveDown(2.5);

      // title
      if (caseData.name) {
        doc
          .fontSize(18)
          .font("Helvetica-Bold")
          .text(caseData.name, { align: "center", paragraphGap: 10 });
      } else {
        doc
          .fontSize(18)
          .font("Helvetica-Bold")
          .text("Legal Case Summary", { align: "center", paragraphGap: 10 });
      }
      doc.font("Helvetica").fontSize(12);

      // court details
      if (caseData.court_details) {
        doc
          .font("Helvetica-Bold")
          .text("Courts:", { paragraphGap: 2, underline: true });
        doc.font("Helvetica").text(caseData.court_details, { paragraphGap: 8 });
      }

      // lawyer details
      if (caseData.lawyer_details) {
        doc.font("Helvetica-Bold").text("Lawyers / Legal Teams:", {
          paragraphGap: 2,
          underline: true,
        });
        doc
          .font("Helvetica")
          .text(caseData.lawyer_details, { paragraphGap: 8 });
      }

      // timeline
      if (
        caseData.timeline &&
        Array.isArray(caseData.timeline) &&
        caseData.timeline.length > 0
      ) {
        doc
          .font("Helvetica-Bold")
          .text("Timeline / Key Events:", { paragraphGap: 5, underline: true });
        doc.font("Helvetica").list(caseData.timeline, {
          bulletRadius: 2,
          textIndent: 10,
          bulletIndent: 0,
        });
        doc.moveDown();
      }

      // verdict
      if (caseData.verdict) {
        doc
          .font("Helvetica-Bold")
          .text("Verdict / Outcome:", { paragraphGap: 2, underline: true });
        doc
          .font("Helvetica")
          .text(caseData.verdict, { align: "justify", paragraphGap: 8 });
      }

      // summary
      if (caseData.summary) {
        doc
          .font("Helvetica-Bold")
          .text("Summary:", { paragraphGap: 2, underline: true });
        doc
          .font("Helvetica")
          .text(caseData.summary, { align: "justify", paragraphGap: 8 });
      }

      // sayonara
      doc.end();
    });

    res.download(outputPath, fileName, (err) => {
      if (err) {
        console.error(`Error sending file ${outputPath} to client:`, err);
      }

      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(
            `Error deleting temporary file ${outputPath}:`,
            unlinkErr
          );
        }
      });
    });
  } catch (error) {
    console.error("Error during PDF generation or sending process:", error);

    if (outputPath) {
      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr && unlinkErr.code !== "ENOENT") {
          console.error(
            `Error cleaning up temporary file ${outputPath} after error:`,
            unlinkErr
          );
        }
      });
    }

    if (!res.headersSent) {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
});

export default router;
