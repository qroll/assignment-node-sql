if (!process.env.NODE_ENV) {
    require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all("*", (req, res, next) => {
    console.log(req.method + " " + req.url);
    next();
});

app.get("/", (req, res) => {
    res.send("hello world");
});

//==============================================================

app.use("/api/register", require("./api/register.js"));
app.use("/api/commonstudents", require("./api/commonstudents.js"));
app.use("/api/suspend", require("./api/suspend.js"));
app.use("/api/retrievefornotifications", require("./api/retrievefornotifications.js"));

app.listen(9000, function() {
    console.log("Example app listening on port 9000!");
});
