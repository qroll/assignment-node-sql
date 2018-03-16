const mockDb = require("mock-knex");
const tracker = mockDb.getTracker();

jest.mock("../../utils/utils");
const utils = require("../../utils/utils");
const ClientError = require("../../utils/ClientError");

const verify = require("../retrieveUtils").verify;
const getRecipients = require("../retrieveUtils").getRecipients;
const getMentions = require("../retrieveUtils").getMentions;

describe("Test verify function in retrieve", () => {
    it("should return teacher id if email exist in database", () => {
        expect.assertions(1);

        jest
            .spyOn(utils, "getTeacherIdFromEmail")
            .mockImplementation(() => Promise.resolve("a"));

        let teacherEmail = "a@t.com";
        let notification = "";

        return expect(verify(teacherEmail, notification)).resolves.toEqual("a");
    });

    it("should raise error if teacher email is not a string", () => {
        expect.assertions(1);

        let teacherEmail = ["a@t.com"];
        let notification = "message";

        return expect(verify(teacherEmail, notification)).rejects.toThrow(
            "invalid teacher email"
        );
    });

    it("should raise error if teacher email is an empty string", () => {
        expect.assertions(1);

        let teacherEmail = "";
        let notification = "message";

        return expect(verify(teacherEmail, notification)).rejects.toThrow(
            "invalid teacher email"
        );
    });

    it("should raise error if notification is not a string", () => {
        expect.assertions(1);

        let teacherEmail = "a@t.com";
        let notification = {};

        return expect(verify(teacherEmail, notification)).rejects.toThrow(
            "invalid notification"
        );
    });
});

describe("Test getMentions function in retrieve", () => {
    it("should return any strings that start with @", () => {
        let notification = "@hello world @bye";

        return expect(getMentions(notification)).toEqual(["hello", "bye"]);
    });

    it("should return the full string that starts with @", () => {
        let notification = "@hello@example.com world";

        return expect(getMentions(notification)).toEqual(["hello@example.com"]);
    });

    it("should ignore empty @", () => {
        let notification = "test @ test";

        return expect(getMentions(notification)).toEqual([]);
    });

    it("should return mention occuring at start of notification", () => {
        let notification = "@hello@example.com world";

        return expect(getMentions(notification)).toEqual(["hello@example.com"]);
    });

    it("should return mention occuring at end of notification", () => {
        let notification = "test @hello@example.com";

        return expect(getMentions(notification)).toEqual(["hello@example.com"]);
    });

    it("should return duplicate mentions", () => {
        let notification = "@hello @hello";

        return expect(getMentions(notification)).toEqual(["hello", "hello"]);
    });
});
