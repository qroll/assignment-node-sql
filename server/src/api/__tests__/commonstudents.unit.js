const httpMocks = require("node-mocks-http");

jest.mock("../commonstudentsUtils");
const utils = require("../commonstudentsUtils");

const verifyAndGetCommonStudents = require("../commonstudents")
    .verifyAndGetCommonStudents;
const ClientError = require("../../utils/ClientError");

describe("Test verifyAndGetCommonStudents function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200 status", () => {
        expect.assertions(3);

        let req = httpMocks.createRequest({
            params: { teacher: "a@example.com" }
        });
        let res = httpMocks.createResponse();

        jest
            .spyOn(utils, "verify")
            .mockImplementation(() => Promise.resolve(["a"]));

        const getCommonStudents = jest
            .spyOn(utils, "getCommonStudents")
            .mockImplementation(() => Promise.resolve(["b", "c"]));

        return verifyAndGetCommonStudents(req, res).then(() => {
            expect(getCommonStudents).toHaveBeenCalledWith(["a"]);
            expect(res.statusCode).toEqual(200);
            expect(JSON.parse(res._getData())).toEqual({
                students: ["b", "c"]
            });
        });
    });

    it("should return 400 status", () => {
        expect.assertions(2);

        let req = httpMocks.createRequest({
            params: {}
        });
        let res = httpMocks.createResponse();

        jest
            .spyOn(utils, "verify")
            .mockImplementation(() => Promise.reject(new ClientError()));

        const getCommonStudents = jest.spyOn(utils, "getCommonStudents");

        return verifyAndGetCommonStudents(req, res).then(() => {
            expect(res.statusCode).toEqual(400);
            expect(getCommonStudents).not.toHaveBeenCalled();
        });
    });

    it("should return 500 status", () => {
        expect.assertions(2);

        let req = httpMocks.createRequest({
            params: { teacher: "a" }
        });
        let res = httpMocks.createResponse();

        jest
            .spyOn(utils, "verify")
            .mockImplementation(() => Promise.resolve(["a"]));

        const register = jest
            .spyOn(utils, "getCommonStudents")
            .mockImplementation(() => Promise.reject(new Error()));

        return verifyAndGetCommonStudents(req, res).then(() => {
            expect(res.statusCode).toEqual(500);
            expect(register).toHaveBeenCalledWith(["a"]);
        });
    });
});
