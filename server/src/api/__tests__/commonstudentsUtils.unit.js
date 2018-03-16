const mockDb = require("mock-knex");
const tracker = mockDb.getTracker();

jest.mock("../../utils/utils");
const utils = require("../../utils/utils");
const ClientError = require("../../utils/ClientError");

const verify = require("../commonstudentsUtils").verify;
const getCommonStudents = require("../commonstudentsUtils").getCommonStudents;

describe("Test verify function in commonstudents", () => {
    it("should return teacher id if email exists in database", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getTeacherIdsFromEmails")
            .mockImplementation(() => Promise.resolve(["a"]));

        let teacherEmail = "a@t.com";

        return expect(verify(teacherEmail)).resolves.toEqual(["a"]);
    });

    it("should return multiple teacher ids if emails exist in database", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getTeacherIdsFromEmails")
            .mockImplementation(() => Promise.resolve(["a", "b"]));

        let teacherEmails = ["a@t.com", "b@t.com"];

        return expect(verify(teacherEmails)).resolves.toEqual(["a", "b"]);
    });

    it("should raise error if teacher email does not exist in database", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getTeacherIdsFromEmails")
            .mockImplementation(() =>
                Promise.reject(new ClientError("teacher not found"))
            );

        let teacherEmail = "a@t.com";

        return expect(verify(teacherEmail)).rejects.toThrow(
            "teacher not found"
        );
    });

    it("should return duplicate teacher ids if duplicate emails are provided", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getTeacherIdsFromEmails")
            .mockImplementation(() => Promise.resolve(["a", "a"]));

        let teacherEmails = ["a@t.com", "a@t.com"];

        return expect(verify(teacherEmails)).resolves.toEqual(["a", "a"]);
    });
});

describe("Test getCommonStudents function in commonstudents", () => {
    beforeEach(() => {
        tracker.install();
    });

    afterEach(() => {
        tracker.uninstall();
    });

    it("should return an array of student emails when query result is non-empty", () => {
        expect.assertions(1);

        tracker.on("query", query => {
            query.response([
                {
                    email: "b@s.com"
                },
                {
                    email: "c@s.com"
                }
            ]);
        });

        let teacherEmails = ["a@t.com"];

        return expect(getCommonStudents(teacherEmails)).resolves.toEqual([
            "b@s.com",
            "c@s.com"
        ]);
    });

    it("should return an empty array when query result is empty", () => {
        expect.assertions(1);

        tracker.on("query", query => {
            query.response([]);
        });

        let teacherEmails = ["a@t.com"];

        return expect(getCommonStudents(teacherEmails)).resolves.toEqual([]);
    });
});
