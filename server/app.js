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

//routes
app.use("/addvideo", require("./routes/addvideo.js"));
app.use("/closeaccount", require("./routes/closeaccount.js"));
app.use("/createlist", require("./routes/createlist.js"));
app.use("/deletelist", require("./routes/deletelist.js"));
app.use("/deletevideo", require("./routes/deletevideo.js"));
app.use("/editlist", require("./routes/editlist.js"));
app.use("/history", require("./routes/history.js"));
app.use("/list", require("./routes/list.js"));
app.use("/lists", require("./routes/lists.js"));
app.use("/userlists", require("./routes/userlists.js"));
app.use("/loghistory", require("./routes/loghistory.js"));
app.use("/login", require("./routes/login.js"));
app.use("/logout", require("./routes/logout.js"));
app.use("/register", require("./routes/register.js"));
app.use("/user", require("./routes/user.js"));

app.get("/", (req, res) => {
    res.send({
        message: `music.topekodev`
    });
});

//conect to mongodb
mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, () =>
  console.log("connected to mongodb")
);

//set port
app.listen(process.env.PORT, () =>
  console.log("listening to port: " + process.env.PORT)
);