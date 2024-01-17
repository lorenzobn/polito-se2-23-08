const pool = require("../db/connection");
const {authorize, logout} = require("../controllers/auth");

jest.mock('../db/connection', () => ({
    query: jest.fn(),
  }));

//authorize
describe("authorize", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call next if role is any", async () => {
        const req = {
            session: {},
        };
        const res = {};
        const next = jest.fn();
        await authorize("any")(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});

//logout
describe("logout", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call next if role is any", async () => {
        const req = {
            session: {},
        };
        const res = {
            //res.status(200).send(); need to mock the "send" function propertie of res
            status: jest.fn().mockReturnValue({
                send: jest.fn(),
            }),


        };

        await logout(req, res);
        expect(res.status).toHaveBeenCalled();
    });
});



