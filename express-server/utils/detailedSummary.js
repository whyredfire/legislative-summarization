import PDFDocument from "pdfkit";
import geminiApi from "./geminiApi";

export const getDetailedSummary = async (text, summary) => {
  const prompt = `Analyze the input text provided below delimited by ---. Extract details *only* from this text related to any legal case mentioned within it.

    ---
    ${text}
    ---
    
    Generate a response containing *only* a single, raw JSON object summarizing the extracted details. The JSON object must strictly adhere to the following schema. Populate the values *using only information explicitly found* within the provided input text. If specific information for a field is not present in the text, use an empty string \\"\\" for string fields or an empty array [] for the timeline field.
    
    JSON Schema:
    {
      "name": "string - The official name of the legal case mentioned in the text. Use an empty string \\"\\" if no name is found.",
      "timeline": "array<string> - An array of strings, where each string describes a key date or significant event related to the case mentioned in the text. Use an empty array [] if no timeline details are found.",
      "lawyer_details": "string - Names of lawyers or legal teams mentioned in the text. Use an empty string \\"\\" if none are found.",
      "court_details": "string - The court(s) involved, as mentioned in the text. Use an empty string \\"\\" if none are found.",
      "verdict": "string - The final decision, judgment, or outcome described in the text. Use an empty string \\"\\" if none is found."
    }
    
    Your response must contain *only* the raw JSON object. Do not include any introductory text, explanations, markdown formatting (like \\\`\\\`\\\`json\\\`\\\`\\\`), or any other characters outside the JSON structure itself.
    `;

  const response = await geminiApi(prompt);

  // remove markdown formatting
  var res = JSON.parse(
    response.text.replace(/^\`\`\`json\s*/, "").replace(/\`\`\`$/, "")
  );

  // append summary
  res["summary"] = summary;
  return res;
};

export const makePDF = (caseData) => {
  try {
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
      bufferPages: true,
    });

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
        .text("AI Generated Summary", { align: "center", paragraphGap: 10 });
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
      doc.font("Helvetica").text(caseData.lawyer_details, { paragraphGap: 8 });
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

    return doc;
  } catch (error) {
    console.error("Error generating PDF stream: ", error);
  }
};
