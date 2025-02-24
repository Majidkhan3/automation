import next from "next";
import { parse } from "url";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const database = process.env.MONGO_URI || "mongodb://localhost:27017/newstack";
const handle = app.getRequestHandler();

const nextCallback = (req, res) => {
  try {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  } catch (err) {
    console.error("Error occurred handling", req.url, err);
    res.statusCode = 500;
    return res.end("internal server error");
  }
};

app.prepare().then(async () => {
  const server = express();
  server.use(cors());

  const { connection } = await mongoose.connect(database);

  console.log(`Connected to MongoDB: ${connection.name}`);
  server.set("trust proxy", 1);
  server.all("*", nextCallback);
  server.all("/_next/webpack-hmr", (req, res) => {
    nextCallback(req, res);
  });

  server.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
  });
});
