const mockDb = require("mock-knex");

const verify = require("../register").verify;

describe("Test verify function in register", () => {
    beforeEach(() => {
        tracker = mockDb.getTracker();
        tracker.install();
    });

    afterEach(() => {
        tracker.uninstall();
    });

    it("should return teacher and single student id if emails exist in database", () => {
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

        let teacherEmail = "a@t.com";
        let studentEmails = ["b@s.com"];

        return verify(teacherEmail, studentEmails).then(data => {
            expect(data).toEqual({
                teacherId: "a",
                studentIds: ["b"]
            });
        });
    });

    it("should return teacher and multiple student ids if emails exist in database", () => {
        expect.assertions(1);

        tracker.on("query", (query, step) => {
            [
                () => {
                    query.response([{ id: "a" }]);
                },
                () => {
                    query.response([{ id: "b" }]);
                },
                () => {
                    query.response([{ id: "c" }]);
                }
            ][step - 1]();
        });

        let teacherEmail = "a@t.com";
        let studentEmails = ["b@s.com", "c@s.com"];

        return verify(teacherEmail, studentEmails).then(data => {
            expect(data).toEqual({
                teacherId: "a",
                studentIds: ["b", "c"]
            });
        });
    });

    it("should raise error if teacher email is not a string", () => {
        expect.assertions(1);

        let teacherEmail = ["a@t.com"];
        let studentEmails = ["b@s.com", "c@s.com"];

        return verify(teacherEmail, studentEmails).catch(err => {
            expect(err.message).toEqual("invalid teacher email");
        });
    });

    it("should raise error if teacher email is an empty string", () => {
        expect.assertions(1);

        let teacherEmail = "";
        let studentEmails = ["b@s.com", "c@s.com"];

        return verify(teacherEmail, studentEmails).catch(err => {
            expect(err.message).toEqual("invalid teacher email");
        });
    });

    it("should raise error if student emails is not an array", () => {
        expect.assertions(1);

        let teacherEmail = "a@t.com";
        let studentEmails = "b.s.com";

        return verify(teacherEmail, studentEmails).catch(err => {
            expect(err.message).toEqual("invalid student email");
        });
    });

    it("should raise error if student emails is an empty array", () => {
        expect.assertions(1);

        let teacherEmail = "a@t.com";
        let studentEmails = [];

        return verify(teacherEmail, studentEmails).catch(err => {
            expect(err.message).toEqual("invalid student email");
        });
    });

    it("should raise error if teacher email does not exist in database", () => {
        expect.assertions(1);

        tracker.on("query", (query, step) => {
            [
                () => {
                    query.response([]);
                },
                () => {
                    query.response([{ id: "b" }]);
                },
                () => {
                    query.response([{ id: "c" }]);
                }
            ][step - 1]();
        });

        let teacherEmail = "a@t.com";
        let studentEmails = ["b@s.com", "c@s.com"];

        return verify(teacherEmail, studentEmails).catch(err => {
            expect(err.message).toEqual("invalid teacher email");
        });
    });

    it("should raise error if any student email does not exist in database", () => {
        expect.assertions(1);

        tracker.on("query", (query, step) => {
            [
                () => {
                    query.response([{ id: "a" }]);
                },
                () => {
                    query.response([{ id: "b" }]);
                },
                () => {
                    query.response([]);
                }
            ][step - 1]();
        });

        let teacherEmail = "a@t.com";
        let studentEmails = ["b@s.com", "c@s.com"];

        return verify(teacherEmail, studentEmails).catch(err => {
            expect(err.message).toEqual("invalid student email");
        });
    });
});
