import express from "express";
import { FASTAPI_SERVER } from "../configs/vars";

const router = express.Router();

router.post("/extractive", async (req, res) => {
  if (!req.body.text) {
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
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/abstractive", async (req, res) => {
  if (!req.body.text) {
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
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
