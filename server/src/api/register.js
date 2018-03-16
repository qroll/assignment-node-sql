const express = require("express");
const router = express.Router();

const { verify, register } = require("./registerUtils");
const ClientError = require("../utils/ClientError");

const verifyAndRegister = (req, res) => {
    let { teacher, students } = req.body;
    return verify(teacher, students)
        .then(({ teacherId, studentIds }) => register(teacherId, studentIds))
        .then(() => res.sendStatus(204))
        .catch(err => {
            console.log(err);
            if (err instanceof ClientError) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        });
};

router.post("/", verifyAndRegister);

module.exports = {
    router,
    verifyAndRegister
};
