const knex = require("../knex.js");

const getTeacherIdsFromEmails = emails =>
    Promise.all(emails.map(email => getTeacherIdFromEmail(email)));

const getTeacherIdFromEmail = email =>
    knex("teachers")
        .select("id")
        .where({ email })
        .then(teacherIds => {
            if (teacherIds.length != 1) {
                return Promise.reject(new Error("teacher not found"));
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
                return Promise.reject(new Error("student not found"));
            }
            return studentIds[0].id;
        });

module.exports = {
    getTeacherIdFromEmail,
    getTeacherIdsFromEmails,
    getStudentIdFromEmail,
    getStudentIdsFromEmails
};
