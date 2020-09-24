import express from "express";
import path from "path";
import cors from "cors";
import logger from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mysql from "mysql";
import router from './routes.js';

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 's1mpl3',
    database: 'phu_1'
})

connection.connect(function(err) {
    if(err){
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId)
});

dotenv.config({ path: path.join(".env" + (process.env.NODE_ENV || "")) });
const app = express();
app.use(
  cors({
    origin: "http://localhost:5000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router)
const port = process.env.PORT || 3800; // Boulevard Malesherbes, Paris 1er
app.listen(port);