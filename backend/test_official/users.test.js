const pool = require("../db/connection");
const { fetchSelf } = require("../controllers/users");

jest.mock("../db/connection", () => ({
  query: jest.fn(),
}));

describe("fetchSelf", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    pool.query.mockClear();
  });

  test("T1.1 - should return 401 if user is not authenticated", async () => {
    const req = {
      session: {},
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await fetchSelf(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: "Unauthorized" });
  });

  test("T1.2 - should return 400 if user is not found in both student and teacher tables", async () => {
    const req = {
      session: {
        user: {
          id: 1,
        },
        clock: {
          time: "2021-03-01T10:00:00.000Z",
        },
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    pool.query.mockImplementationOnce(() => ({
      rows: [],
      rowCount: 0,
    }));

    pool.query.mockImplementationOnce(() => ({
      rows: [],
      rowCount: 0,
    }));

    await fetchSelf(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "Invalid email" });
  });

  test("T1.3 - should return student data if user is found in student table", async () => {
    const req = {
      session: {
        user: {
          id: 1,
        },
        clock: {
          time: "2021-03-01T10:00:00.000Z",
        },
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const studentData = {
      id: 1,
      name: "John",
      surname: "Doe",
    };

    pool.query.mockImplementationOnce(() => ({
      rows: [studentData],
      rowCount: 1,
    }));

    pool.query.mockImplementationOnce(() => ({
      rows: [],
      rowCount: 0,
    }));

    await fetchSelf(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { ...studentData, type: "student" } });
  });

  test("T1.4 - should return teacher data if user is found in teacher table", async () => {
    const req = {
      session: {
        user: {
          id: 1,
        },
        clock: {
          time: "2021-03-01T10:00:00.000Z",
        },
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const teacherData = {
      id: 1,
      name: "Jane",
      surname: "Smith",
    };

    pool.query.mockImplementationOnce(() => ({
      rows: [],
      rowCount: 0,
    }));

    pool.query.mockImplementationOnce(() => ({
      rows: [teacherData],
      rowCount: 1,
    }));

    await fetchSelf(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { ...teacherData, type: "professor" } });
  });

  test("T1.5 - should return 500 if an error occurs", async () => {
    const req = {
      session: {
        user: {
          id: 1,
        },
        clock: {
          time: "2021-03-01T10:00:00.000Z",
        },
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    pool.query.mockImplementation(() => {
      throw new Error("Database error");
    });

    await fetchSelf(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
  
});