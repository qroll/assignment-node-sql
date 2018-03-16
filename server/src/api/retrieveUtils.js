const _ = require("lodash");

const knex = require("../knex.js");
const { getTeacherIdFromEmail } = require("../utils/utils");
const ClientError = require("../utils/ClientError");

const verify = (teacher, notification) => {
    if (typeof teacher !== "string" || teacher.length === 0) {
        return Promise.reject(new ClientError("invalid teacher email"));
    }
    if (typeof notification !== "string") {
        return Promise.reject(new ClientError("invalid notification"));
    }
    return getTeacherIdFromEmail(teacher);
};

const getRecipients = (teacherId, notification) => {
    const mentions = getMentions(notification);
    return Promise.all([
        getMentionedStudents(notification),
        getRegisteredStudents(teacherId)
    ]).then(([mentioned, registered]) => {
        return _.sortBy(
            _.uniq([...mentioned, ...registered].map(student => student.email))
        );
    });
};

const getRegisteredStudents = teacherId => {
    return knex("students")
        .join("registration", "students.id", "registration.studentId")
        .select("students.email")
        .where("registration.teacherId", teacherId)
        .andWhere("students.isSuspended", false);
};

const getMentionedStudents = notification => {
    let mentions = getMentions(notification);
    return knex("students")
        .select("email")
        .whereIn("email", mentions)
        .andWhere("isSuspended", false);
};

const getMentions = notification => {
    let mentions = notification.match(/@[^\s]+/g);
    if (mentions === null) {
        // no matches found
        return [];
    }
    return mentions.map(mention => mention.substr(1));
};

module.exports = {
    verify,
    getRecipients,
    getMentions
};
