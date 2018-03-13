const knex = require("../knex.js");
const {
    getStudentIdsFromEmails,
    getTeacherIdFromEmail
} = require("../utils/utils");
const ClientError = require("../utils/ClientError");

const verify = (teacher, students) => {
    if (typeof teacher !== "string" || teacher.length === 0) {
        return Promise.reject(new ClientError("invalid teacher email"));
    }
    if (!Array.isArray(students) || students.length === 0) {
        return Promise.reject(new ClientError("invalid student email"));
    }
    return getTeacherIdFromEmail(teacher).then(teacherId =>
        getStudentIdsFromEmails(students).then(studentIds => ({
            teacherId,
            studentIds
        }))
    );
};

const register = (teacherId, studentIds) => {
    return knex.transaction(trx =>
        trx
            .insert(
                studentIds.map(studentId => ({
                    teacherId,
                    studentId
                }))
            )
            .into("registration")
    );
};

module.exports = {
    verify,
    register
};
