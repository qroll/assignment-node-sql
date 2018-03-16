const express = require("express");
const router = express.Router();

const { verify, suspend } = require("./suspendUtils");
const ClientError = require("../utils/ClientError");

const verifyAndSuspend = (req, res) => {
    let { student } = req.body;
    return verify(student)
        .then(studentId => suspend(studentId))
        .then(() => res.sendStatus(204))
        .catch(err => {
            if (err instanceof ClientError) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        });
};

router.get("/", verifyAndSuspend);

module.exports = {
    router,
    verifyAndSuspend
};
