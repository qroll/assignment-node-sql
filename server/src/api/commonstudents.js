const express = require("express");
const router = express.Router();

const { verify, getCommonStudents } = require("./commonstudentsUtils");
const { getTeacherIdsFromEmails } = require("../utils/utils");
const ClientError = require("../utils/ClientError");

const verifyAndGetCommonStudents = (req, res) => {
    let { teacher } = req.query;
    return verify(teacher)
        .then(teacherIds => getCommonStudents(teacherIds))
        .then(students => {
            res.status(200).json({ students });
        })
        .catch(err => {
            if (err instanceof ClientError) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        });
};

router.get("/", verifyAndGetCommonStudents);

module.exports = {
    router,
    verifyAndGetCommonStudents
};
