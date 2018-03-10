const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log(req.query);
    res.send("commonstudents");
});

module.exports = router;
