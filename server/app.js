const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: true}));
app.use(cookieParser());

//set environment variables
const {
    NODE_ENV, PORT, DB_URL, TOKEN_SECRET, CLIENT_URL
} = process.env
console.log(NODE_ENV);

//routes
const sendRoute = require("./routes/send.js");
app.use("/send", sendRoute);

const getRoute = require("./routes/get.js");
app.use("/get", getRoute);

app.get("/", (req, res) => {
    res.send({
        message: `Hello world!`
    });
});

//conect to mongodb
mongoose.connect(DB_URL, { useNewUrlParser: true }, () =>
  console.log("connected to mongodb")
);

//set port
app.listen(PORT);