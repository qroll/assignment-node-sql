const knex = require("../knex.js");

const getTeacherIdFromEmail = email =>
    knex("teachers")
        .select("id")
        .where({ email })
        .then(teacherIds => {
            if (teacherIds.length != 1) {
                throw { code: 400, message: "invalid teacher email" };
            }
            return teacherIds[0].id;
        });

const getStudentIdsFromEmails = emails =>
    Promise.all(emails.map(email => getStudentIdFromEmail(email)));

const getStudentIdFromEmail = email =>
    knex("students")
        .select("id")
        .where({ email })
        .then(studentIds => {
            if (studentIds.length != 1) {
                throw { code: 400, message: "invalid student email" };
            }
            return studentIds[0].id;
        });

module.exports = {
    getTeacherIdFromEmail,
    getStudentIdFromEmail,
    getStudentIdsFromEmails
};
