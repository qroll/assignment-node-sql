const httpMocks = require("node-mocks-http");

jest.mock("../registerUtils");
const utils = require("../registerUtils");

const verifyAndRegister = require("../register").verifyAndRegister;
const ClientError = require("../../utils/ClientError");

describe("Test verifyAndRegister function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 204 status", () => {
        expect.assertions(2);

        let req = httpMocks.createRequest({
            body: { teacher: "a@example.com", studentIds: ["b@gmail.com"] }
        });
        let res = httpMocks.createResponse();

        jest
            .spyOn(utils, "verify")
            .mockImplementation(() =>
                Promise.resolve({ teacherId: "a", studentIds: ["b", "c"] })
            );

        const register = jest
            .spyOn(utils, "register")
            .mockImplementation(() => Promise.resolve());

        return verifyAndRegister(req, res).then(() => {
            expect(res.statusCode).toEqual(204);
            expect(register).toHaveBeenCalledWith("a", ["b", "c"]);
        });
    });

    it("should return 400 status", () => {
        expect.assertions(2);

        let req = httpMocks.createRequest({
            body: { teacher: "a@example.com", studentIds: ["b@gmail.com"] }
        });
        let res = httpMocks.createResponse();

        jest
            .spyOn(utils, "verify")
            .mockImplementation(() => Promise.reject(new ClientError()));

        const register = jest.spyOn(utils, "register");

        return verifyAndRegister(req, res).then(() => {
            expect(res.statusCode).toEqual(400);
            expect(register).not.toHaveBeenCalled();
        });
    });

    it("should return 500 status", () => {
        expect.assertions(2);

        let req = httpMocks.createRequest({
            body: { teacher: "a@example.com", studentIds: ["b@gmail.com"] }
        });
        let res = httpMocks.createResponse();

        jest
            .spyOn(utils, "verify")
            .mockImplementation(() =>
                Promise.resolve({ teacherId: "a", studentIds: ["b", "c"] })
            );

        const register = jest
            .spyOn(utils, "register")
            .mockImplementation(() => Promise.reject(new Error()));

        return verifyAndRegister(req, res).then(() => {
            expect(res.statusCode).toEqual(500);
            expect(register).toHaveBeenCalledWith("a", ["b", "c"]);
        });
    });
});
