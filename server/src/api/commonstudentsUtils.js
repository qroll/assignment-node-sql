const _ = require("lodash");
const knex = require("../knex.js");
const { getTeacherIdsFromEmails } = require("../utils/utils");

const verify = field => {
    let teachers = field;
    if (typeof field === "string") {
        teachers = [field];
    }
    return getTeacherIdsFromEmails(teachers);
};

const getCommonStudents = teacherIds => {
    let uniqueTeacherIds = _.uniq(teacherIds);
    return knex("registration")
        .join("students", "registration.studentId", "students.id")
        .select("students.email")
        .whereIn("teacherId", uniqueTeacherIds)
        .groupBy("studentId")
        .havingRaw("count(*) = ?", uniqueTeacherIds.length)
        .then(students => students.map(student => student.email));
};

module.exports = {
    verify,
    getCommonStudents
};
