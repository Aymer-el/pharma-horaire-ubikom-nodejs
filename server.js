import express from "express";
import path from "path";
import cors from "cors";
import logger from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from './routes.js';
import connection from './sql.utils.js'

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    // new ControllerData().sendDataToServer();
    console.log('connected')
  }
});

dotenv.config({ path: path.join(".env" + (process.env.NODE_ENV || "")) });
const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router)
const port = 3800; // Boulevard Malesherbes, Paris 1er
app.listen(port);