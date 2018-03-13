const express = require("express");
const router = express.Router();

const knex = require("../knex.js");

router.get("/", (req, res) => {
    getRegistration()
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

const getRegistration = () =>
    knex("registration")
        .join("students", "registration.studentId", "students.id")
        .join("teachers", "registration.teacherId", "teachers.id")
        .select({
            teacherEmail: "teachers.email",
            studentEmail: "students.email"
        })
        .from("registration");

module.exports = router;
