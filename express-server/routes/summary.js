import express from "express";
import { FASTAPI_SERVER } from "../configs/vars";
import { isAuthenticated } from "../middleware/authMiddleware";
import { saveSummary } from "../utils/saveHistory";
import prisma from "../configs/prisma";

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

export default router;
