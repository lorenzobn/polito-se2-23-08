const { searchTeacherByName, searchTeacherByEmail } = require('../controllers/teacher');
const pool = require("../db/connection");

jest.mock('../db/connection', () => ({
    query: jest.fn(),
  }));

describe("T1 -- searchTeacherByName", () => {

  test("T1.1 -- should return 404 if teacher is not found", async () => {
    const req = {
        query: {
            name: "John",
            surname: "Doe"
        },
        session: {
            clock: {
                time: "2021-03-01T10:00:00.000Z"
            }
        }
    }

    const res = {
        status: jest.fn(() => res),
        json: jest.fn()
    }

    pool.query.mockImplementation(() => ({
        rows: [],
        rowCount: 0
    }));

    await searchTeacherByName(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Teacher not found" });

  });

  test("T1.2 -- should return 200 if teacher is found", async () => {
    const req = {
        query: {
            name: "John",
            surname: "Doe"
        },
        session: {
            clock: {
                time: "2021-03-01T10:00:00.000Z"
            }
        }
    }

    const res = {
        status: jest.fn(() => res),
        json: jest.fn()
    }

    pool.query.mockImplementation(() => ({
        rows: [{
            name: "John",
            surname: "Doe"
        }],
        rowCount: 1
    }));

    await searchTeacherByName(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ name: "John", surname: "Doe" }]);

  });
});

describe("T2 -- searchTeacherByEmail", () => {

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("T2.1 -- should return 400 if email format is invalid", async () => {
      const req = { query: { email: 'invalidEmail' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };
  
      await searchTeacherByEmail(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Invalid email format" });
    });
  
    test("T2.2 -- should return 404 if teacher is not found", async () => {
      const req = { query: { email: 'teacher@notfound.com' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };
  
      pool.query.mockResolvedValueOnce({ rows: [] , rowCount: 0});
  
      await searchTeacherByEmail(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Teacher not found" });
    });
  
    test("T2.3 -- should return 200 and the teacher data if teacher is found", async () => {
      const req = { query: { email: 'teacher@found.com' } };
      const res = { status: jest.fn(() => res), json: jest.fn() };
  
      const mockTeacher = { /* dati dell'insegnante */ };
      pool.query.mockResolvedValueOnce({ rows: [mockTeacher] , rowCount: 1});
  
      await searchTeacherByEmail(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockTeacher]);
    });
  });
        


