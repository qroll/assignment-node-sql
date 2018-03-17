const express = require("express");
const router = express.Router();

const { verify, getRecipients } = require("./retrieveUtils");
const ClientError = require("../utils/ClientError");

const retrieveRecipients = (req, res) => {
    let { teacher, notification } = req.body;
    return verify(teacher, notification)
        .then(teacherId => getRecipients(teacherId, notification))
        .then(recipients => {
            res.status(200).json({ recipients });
        })
        .catch(err => {
            if (process.env.NODE_ENV === "development") {
                console.log(err);
            }
            if (err instanceof ClientError) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        });
};

router.post("/", retrieveRecipients);

module.exports = {
    router,
    retrieveRecipients
};
