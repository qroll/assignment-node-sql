const mockDb = require("mock-knex");
const tracker = mockDb.getTracker();
const httpMocks = require("node-mocks-http");

jest.mock("../../utils/utils");
const utils = require("../../utils/utils");
const ClientError = require("../../utils/ClientError");

const verify = require("../suspendUtils").verify;
const suspend = require("../suspendUtils").suspend;

describe("Test verify function in suspend", () => {
    it("should return student id if email exists in database", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getStudentIdFromEmail")
            .mockImplementation(() => Promise.resolve("b"));

        let studentEmail = "b@s.com";

        return expect(verify(studentEmail)).resolves.toEqual("b");
    });

    it("should raise error if student email is not a string", () => {
        expect.assertions(1);

        let studentEmail = 1;

        return expect(verify(studentEmail)).rejects.toThrow(
            "invalid student email"
        );
    });

    it("should raise error if student email is an empty string", () => {
        expect.assertions(1);

        let studentEmail = "";

        return expect(verify(studentEmail)).rejects.toThrow(
            "invalid student email"
        );
    });

    it("should raise error if student email does not exist in database", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getStudentIdFromEmail")
            .mockImplementation(() =>
                Promise.reject(new ClientError("student not found"))
            );

        let studentEmail = "b@s.com";

        return expect(verify(studentEmail)).rejects.toThrow(
            "student not found"
        );
    });
});

describe("Test suspend function in suspend", () => {
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

        let studentId = "b";

        return expect(suspend(studentId)).rejects.toThrow();
    });
});
