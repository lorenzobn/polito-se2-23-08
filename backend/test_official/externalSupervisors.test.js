const { searchExternalByName, searchExternalByEmail, insertExternal, getAllExternal } = require('../controllers/externalSupervisor'); // Replace 'yourModule' with the actual path to your module
const pool = require('../db/connection');

jest.mock('../db/connection', () => ({
  query: jest.fn(),
}));

describe('T1 -- searchExternalByName Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T1.1 - should find external co-supervisor by name and surname', async () => {
    const req = {
      query: {
        name: 'John',
        surname: 'Doe',
      },
      session: {
        clock: {
          time: new Date('2023-01-01T12:00:00Z'),
        },
      },
    };

    const mockResult = {
      rows: [{ id: 1, name: 'John', surname: 'Doe' }],
    };

    pool.query.mockResolvedValueOnce(mockResult);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await searchExternalByName(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult.rows);
  });

  it('T1.2 - should handle case where external co-supervisor is not found', async () => {
    const req = {
      query: {
        name: 'Nonexistent',
        surname: 'Person',
      },
      session: {
        clock: {
          time: new Date('2023-01-01T12:00:00Z'),
        },
      },
    };

    const mockResult = {
      rows: [],
    };

    pool.query.mockResolvedValueOnce(mockResult);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await searchExternalByName(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'External supervisor not found' });
  });

  it('T1.3 - should handle errors when querying the database', async () => {
    const req = {
      query: {
        name: 'John',
        surname: 'Doe',
      },
      session: {
        clock: {
          time: new Date('2023-01-01T12:00:00Z'),
        },
      },
    };

    const errorMock = new Error('Database error');
    pool.query.mockRejectedValueOnce(errorMock);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await searchExternalByName(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
  });
});


describe('T2 -- searchExternalByEmail Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T2.1 - should find external co-supervisor by email', async () => {
    const req = {
      query: {
        email: 'john.doe@example.com',
      },
      session: {
        clock: {
          time: new Date('2023-01-01T12:00:00Z'),
        },
      },
    };

    const mockResult = {
      rows: [{ id: 1, name: 'John', surname: 'Doe', email: 'john.doe@example.com' }],
    };

    pool.query.mockResolvedValueOnce(mockResult);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await searchExternalByEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult.rows);
  });

  it('T2.2 - should handle case where external co-supervisor is not found', async () => {
    const req = {
      query: {
        email: 'nonexistent@example.com',
      },
      session: {
        clock: {
          time: new Date('2023-01-01T12:00:00Z'),
        },
      },
    };

    const mockResult = {
      rows: [],
    };

    pool.query.mockResolvedValueOnce(mockResult);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await searchExternalByEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'External supervisor not found' });
  });

  it('T2.3 - should handle invalid email format', async () => {
    const req = {
      query: {
        email: 'invalidemail',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await searchExternalByEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid email format' });
    expect(pool.query).not.toHaveBeenCalled(); // Ensure that the query was not called when the email format is invalid
  });

  it('T2.4 - should handle errors when querying the database', async () => {
    const req = {
      query: {
        email: 'john.doe@example.com',
      },
      session: {
        clock: {
          time: new Date('2023-01-01T12:00:00Z'),
        },
      },
    };

    const expectedQuery = {
      text: expect.any(String),
      values: ['john.doe@example.com', req.session.clock.time],
    };

    const errorMock = new Error('Database error');
    pool.query.mockRejectedValueOnce(errorMock);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await searchExternalByEmail(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
  });
});


describe('T3 -- insertExternal Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T3.1 - should insert a new external supervisor', async () => {
    const req = {
      body: {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
      },
    };

    const mockResult = {
      rows: [{ id: 1, name: 'John', surname: 'Doe', email: 'john.doe@example.com' }],
    };

    pool.query.mockResolvedValueOnce(mockResult);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await insertExternal(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult.rows);
  });

  it('T3.2 - should handle invalid email format', async () => {
    const req = {
      body: {
        name: 'John',
        surname: 'Doe',
        email: 'invalidemail',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await insertExternal(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid email format' });
    expect(pool.query).not.toHaveBeenCalled(); // Ensure that the query was not called when the email format is invalid
  });

  it('T3.3 - should handle errors when querying the database', async () => {
    const req = {
      body: {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
      },
    };

    const errorMock = new Error('Database error');
    pool.query.mockRejectedValueOnce(errorMock);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await insertExternal(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});


describe('T4 -- getAllExternal Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T4.1 - should get all external supervisors', async () => {
    const req = {
      session: {
        clock: {
          time: new Date('2023-01-01T12:00:00Z'),
        },
      },
    };

    const mockResult = {
      rows: [
        { id: 1, name: 'John', surname: 'Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com' },
      ],
    };

    pool.query.mockResolvedValueOnce(mockResult);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllExternal(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResult.rows);
  });

  it('T4.2 - should handle errors when querying the database', async () => {
    const req = {
      session: {
        clock: {
          time: new Date('2023-01-01T12:00:00Z'),
        },
      },
    };

    const errorMock = new Error('Database error');
    pool.query.mockRejectedValueOnce(errorMock);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await (getAllExternal(req, res));
    expect(res.status).toHaveBeenCalledWith(500)

  });
});




