import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import fs from "fs";
import multer from "multer";
import { PDFExtract } from "pdf.js-extract";

const router = express.Router();
const uploads = multer({ dest: "uploads/" });

router.post(
  "/extract",
  uploads.single("file"),
  isAuthenticated,
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // check for .txt and .pdf files
    const isFileTxt = req.file.originalname.endsWith(".txt");
    const isFilePdf = req.file.originalname.endsWith(".pdf");

    if (!isFileTxt && !isFilePdf) {
      return res.status(400).json({
        message: "Only .txt and .pdf files are supported",
      });
    }

    try {
      // if file is .txt
      if (isFileTxt) {
        const contents = fs.readFileSync(req.file.path, "utf-8");

        // delete the file after reading
        fs.unlinkSync(req.file.path);

        return res.status(200).json({
          message: "OK",
          extracted_text: contents,
        });
      }

      // if file is .pdf
      if (isFilePdf) {
        const pdfextract = new PDFExtract();
        const options = {};
        pdfextract.extract(req.file.path, options, (err, data) => {
          if (err) return console.log(err);

          // join all page contents
          const extractedText = data.pages
            .flatMap((page) => page.content.map((item) => item.str))
            .join(" ");

          res.status(200).json({
            message: "ok",
            extracted_text: extractedText,
          });
        });
      }
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

export default router;
