const mockDb = require("mock-knex");
const tracker = mockDb.getTracker();

const getTeacherIdFromEmail = require("../utils").getTeacherIdFromEmail;
const getTeacherIdsFromEmails = require("../utils").getTeacherIdsFromEmails;

describe("Test getTeacherIdFromEmail", () => {
    beforeEach(() => {
        tracker.install();
    });

    afterEach(() => {
        tracker.uninstall();
    });

    it("should return a rejected promise when input is not a string", () => {
        expect.assertions(1);
        return expect(getTeacherIdFromEmail(null)).rejects.toThrow();
    });

    it("should return the corresponding id", () => {
        expect.assertions(1);

        tracker.on("query", query => {
            query.response([
                {
                    id: "a"
                }
            ]);
        });

        return expect(getTeacherIdFromEmail("a@t.com")).resolves.toEqual("a");
    });

    it("should return a rejected promise when more than one id is found", () => {
        expect.assertions(1);

        tracker.on("query", query => {
            query.response([
                {
                    id: "a"
                },
                {
                    id: "b"
                }
            ]);
        });

        return expect(getTeacherIdFromEmail("a@t.com")).rejects.toThrow();
    });
});

describe("Test getTeacherIdsFromEmails", () => {
    beforeEach(() => {
        tracker.install();
    });

    afterEach(() => {
        tracker.uninstall();
    });

    it("should return a rejected promise when input is not an array", () => {
        expect.assertions(1);
        return expect(getTeacherIdsFromEmails(null)).rejects.toThrow();
    });

    it("should return a rejected promise when any input is invalid", () => {
        expect.assertions(1);
        return expect(getTeacherIdsFromEmails([null])).rejects.toThrow();
    });

    it("should return the corresponding ids", () => {
        expect.assertions(1);

        tracker.on("query", (query, step) => {
            [
                () => {
                    query.response([{ id: "a" }]);
                },
                () => {
                    query.response([{ id: "b" }]);
                }
            ][step - 1]();
        });

        return expect(
            getTeacherIdsFromEmails(["a@t.com", "b@t.com"])
        ).resolves.toEqual(["a", "b"]);
    });

    it("should return a rejected promise when more than one id is found", () => {
        expect.assertions(1);

        tracker.on("query", (query, step) => {
            query.response([
                {
                    id: "a"
                },
                {
                    id: "b"
                }
            ]);
        });

        return expect(getTeacherIdsFromEmails(["a@t.com"])).rejects.toThrow();
    });
});
