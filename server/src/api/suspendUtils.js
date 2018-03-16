const knex = require("../knex.js");
const { getStudentIdFromEmail } = require("../utils/utils");
const ClientError = require("../utils/ClientError");

const verify = student => {
    if (typeof student !== "string" || student.length === 0) {
        return Promise.reject(new ClientError("invalid student email"));
    }
    return getStudentIdFromEmail(student);
};

const suspend = studentId => {
    return knex("students")
        .where({ id: studentId })
        .update({ isSuspended: true });
};

module.exports = {
    verify,
    suspend
};
