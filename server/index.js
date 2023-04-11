import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import Connection from "./database/db.js";
import router from "./routes/route.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", router);

const PORT = 3500;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

Connection(USERNAME, PASSWORD);
