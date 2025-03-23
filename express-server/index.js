import express from "express";
import customRouter from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", customRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Legislative Summarization app listening on port ${port}`);
});
