const mockDb = require("mock-knex");
const tracker = mockDb.getTracker();
const httpMocks = require("node-mocks-http");

jest.mock("../../utils/utils");
const utils = require("../../utils/utils");
const ClientError = require("../../utils/ClientError");

const verify = require("../registerUtils").verify;
const register = require("../registerUtils").register;

describe("Test verify function in register", () => {
    it("should return teacher and single student id if emails exist in database", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getTeacherIdFromEmail")
            .mockImplementation(() => Promise.resolve("a"));
        jest
            .spyOn(utils, "getStudentIdsFromEmails")
            .mockImplementation(() => Promise.resolve(["b"]));

        let teacherEmail = "a@t.com";
        let studentEmails = ["b@s.com"];

        return expect(verify(teacherEmail, studentEmails)).resolves.toEqual({
            teacherId: "a",
            studentIds: ["b"]
        });
    });

    it("should return teacher and multiple student ids if emails exist in database", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getTeacherIdFromEmail")
            .mockImplementation(() => Promise.resolve("a"));
        jest
            .spyOn(utils, "getStudentIdsFromEmails")
            .mockImplementation(() => Promise.resolve(["b", "c"]));

        let teacherEmail = "a@t.com";
        let studentEmails = ["b@s.com", "c@s.com"];

        return expect(verify(teacherEmail, studentEmails)).resolves.toEqual({
            teacherId: "a",
            studentIds: ["b", "c"]
        });
    });

    it("should raise error if teacher email is not a string", () => {
        expect.assertions(1);

        let teacherEmail = ["a@t.com"];
        let studentEmails = ["b@s.com", "c@s.com"];

        return expect(verify(teacherEmail, studentEmails)).rejects.toThrow(
            "invalid teacher email"
        );
    });

    it("should raise error if teacher email is an empty string", () => {
        expect.assertions(1);

        let teacherEmail = "";
        let studentEmails = ["b@s.com", "c@s.com"];

        return expect(verify(teacherEmail, studentEmails)).rejects.toThrow(
            "invalid teacher email"
        );
    });

    it("should raise error if student emails is not an array", () => {
        expect.assertions(1);

        let teacherEmail = "a@t.com";
        let studentEmails = "b.s.com";

        return expect(verify(teacherEmail, studentEmails)).rejects.toThrow(
            "invalid student email"
        );
    });

    it("should raise error if student emails is an empty array", () => {
        expect.assertions(1);

        let teacherEmail = "a@t.com";
        let studentEmails = [];

        return expect(verify(teacherEmail, studentEmails)).rejects.toThrow(
            "invalid student email"
        );
    });

    it("should raise error if teacher email does not exist in database", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getTeacherIdFromEmail")
            .mockImplementation(() =>
                Promise.reject(new ClientError("teacher not found"))
            );

        let teacherEmail = "a@t.com";
        let studentEmails = ["b@s.com", "c@s.com"];

        return expect(verify(teacherEmail, studentEmails)).rejects.toThrow(
            "teacher not found"
        );
    });

    it("should raise error if any student email does not exist in database", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getTeacherIdFromEmail")
            .mockImplementation(() => Promise.resolve("a"));
        jest
            .spyOn(utils, "getStudentIdsFromEmails")
            .mockImplementation(() =>
                Promise.reject(new ClientError("student not found"))
            );

        let teacherEmail = "a@t.com";
        let studentEmails = ["b@s.com", "c@s.com"];

        return expect(verify(teacherEmail, studentEmails)).rejects.toThrow(
            "student not found"
        );
    });

    it("should return duplicate student ids if duplicate emails are provided", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getTeacherIdFromEmail")
            .mockImplementation(() => Promise.resolve("a"));
        jest
            .spyOn(utils, "getStudentIdsFromEmails")
            .mockImplementation(() => Promise.resolve(["b", "b"]));

        let teacherEmail = "a@t.com";
        let studentEmails = ["b@s.com", "b@s.com"];

        return expect(verify(teacherEmail, studentEmails)).resolves.toEqual({
            teacherId: "a",
            studentIds: ["b", "b"]
        });
    });
});

describe("Test register function in register", () => {
    beforeEach(() => {
        tracker.install();
    });

    afterEach(() => {
        tracker.uninstall();
    });

    it("should return rejected promise when query fails", () => {
        expect.assertions(1);

        tracker.on("query", query => {
            query.reject();
        });

        let teacherId = "";
        let studentIds = [];

        return expect(register(teacherId, studentIds)).rejects.toThrow();
    });
});
