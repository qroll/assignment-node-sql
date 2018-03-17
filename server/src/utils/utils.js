const knex = require("../knex.js");

// Given an array of emails, retrieve the corresponding teacher ids.
// Returns a rejected Promise if input is invalid, email does not
// belong to a teacher or a database error occurred.
const getTeacherIdsFromEmails = emails => {
    if (!Array.isArray(emails)) {
        return Promise.reject(new TypeError("emails is not an array"));
    }
    return Promise.all(emails.map(email => getTeacherIdFromEmail(email)));
};

const getTeacherIdFromEmail = email => {
    if (typeof email !== "string") {
        return Promise.reject(new TypeError("email is not a string"));
    }
    return knex("teachers")
        .select("id")
        .where({ email })
        .then(teacherIds => {
            if (teacherIds.length != 1) {
                return Promise.reject(new Error("teacher not found"));
            }
            return teacherIds[0].id;
        });
};

// Given an array of emails, retrieve the corresponding student ids.
// Returns a rejected Promise if input is invalid, email does not
// belong to a student or a database error occurred.
const getStudentIdsFromEmails = emails => {
    if (!Array.isArray(emails)) {
        return Promise.reject(new TypeError("emails is not an array"));
    }
    return Promise.all(emails.map(email => getStudentIdFromEmail(email)));
};

const getStudentIdFromEmail = email => {
    if (typeof email !== "string") {
        return Promise.reject(new TypeError("email is not a string"));
    }
    return knex("students")
        .select("id")
        .where({ email })
        .then(studentIds => {
            if (studentIds.length != 1) {
                return Promise.reject(new Error("student not found"));
            }
            return studentIds[0].id;
        });
};

module.exports = {
    getTeacherIdFromEmail,
    getTeacherIdsFromEmails,
    getStudentIdFromEmail,
    getStudentIdsFromEmails
};
