const express = require("express");
const router = express.Router();

const knex = require("../knex.js");

const {
    getStudentIdsFromEmails,
    getTeacherIdFromEmail
} = require("../utils/utils");

router.post("/", (req, res) => {
    let { teacher, students } = req.body;
    verifyAndRegister(teacher, students)
        .then(() => res.sendStatus(204))
        .catch(err => {
            let { code, message } = err;
            res.status(code).json({ message });
        });
});

const verifyAndRegister = (teacher, students) =>
    verify(teacher, students).then(({ teacherId, studentIds }) =>
        register(teacherId, studentIds)
    );

const verify = (teacher, students) => {
    if (typeof teacher !== "string" || teacher.length == 0) {
        return Promise.reject({ code: 400, message: "invalid teacher email" });
    }
    if (!Array.isArray(students) || students.length == 0) {
        return Promise.reject({ code: 400, message: "invalid student email" });
    }
    return getTeacherIdFromEmail(teacher).then(teacherId =>
        getStudentIdsFromEmails(students).then(studentIds => ({
            teacherId,
            studentIds
        }))
    );
};

const register = (teacherId, studentIds) =>
    knex.transaction(trx =>
        trx
            .insert(
                studentIds.map(studentId => ({
                    teacherId,
                    studentId
                }))
            )
            .into("registration")
    );

module.exports = {
    router,
    verify,
    register
};
