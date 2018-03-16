const httpMocks = require("node-mocks-http");

jest.mock("../retrieveUtils");
const utils = require("../retrieveUtils");

const retrieveRecipients = require("../retrievefornotifications")
    .retrieveRecipients;
const ClientError = require("../../utils/ClientError");

describe("Test retrieveRecipients function", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200 status", () => {
        expect.assertions(3);

        let req = httpMocks.createRequest({
            body: { teacher: "a", notification: "notif" }
        });
        let res = httpMocks.createResponse();

        jest
            .spyOn(utils, "verify")
            .mockImplementation(() => Promise.resolve("a"));

        const getRecipients = jest
            .spyOn(utils, "getRecipients")
            .mockImplementation(() => Promise.resolve(["b", "c"]));

        return retrieveRecipients(req, res).then(() => {
            expect(res.statusCode).toEqual(200);
            expect(getRecipients).toHaveBeenCalledWith("a", "notif");
            expect(JSON.parse(res._getData())).toEqual({
                recipients: ["b", "c"]
            });
        });
    });

    it("should return 400 status", () => {
        expect.assertions(2);

        let req = httpMocks.createRequest({
            body: { teacher: "a", notification: "notif" }
        });
        let res = httpMocks.createResponse();

        jest
            .spyOn(utils, "verify")
            .mockImplementation(() => Promise.reject(new ClientError()));

        const getRecipients = jest.spyOn(utils, "getRecipients");

        return retrieveRecipients(req, res).then(() => {
            expect(res.statusCode).toEqual(400);
            expect(getRecipients).not.toHaveBeenCalled();
        });
    });

    it("should return 500 status", () => {
        expect.assertions(2);

        let req = httpMocks.createRequest({
            body: { teacher: "a", notification: "notif" }
        });
        let res = httpMocks.createResponse();

        jest
            .spyOn(utils, "verify")
            .mockImplementation(() => Promise.resolve("a"));

        const getRecipients = jest
            .spyOn(utils, "getRecipients")
            .mockImplementation(() => Promise.reject(new Error()));

        return retrieveRecipients(req, res).then(() => {
            expect(res.statusCode).toEqual(500);
            expect(getRecipients).toHaveBeenCalledWith("a", "notif");
        });
    });
});
