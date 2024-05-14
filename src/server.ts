import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mogan from "morgan";
dotenv.config();
require("express-async-errors");

const app = express();
import router from "./routers";
import mongoose from "mongoose";
import { Response, Request } from "./base/baseRoute";
import { NextFunction } from "express";

let mongo_uri: any = process.env.MONGO_URI;
const PORT = process.env.PORT;

//connect to MongoDB
async function connectToMongoDB(connectionString: string) {
  await mongoose.connect(connectionString);
  console.log("Connected to MongoDB");
}
try {
  connectToMongoDB(mongo_uri);
} catch (err) {
  console.log("Error connecting to MongoDB:", err);
}

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(mogan("common"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use("/", router);
//Handle error in middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.info.status).send(err.info);
});

//app listening
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
