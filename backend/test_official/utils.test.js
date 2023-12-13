const pool = require("../db/connection");
const { coSupervisorAdd, getExtCoSupervisors } = require('../controllers/utils'); // Replace 'yourModule' with the actual path to your module
const logger = require('../services/logger.js');

// Mocking pool.query
jest.mock('../db/connection', () => ({
  query: jest.fn(),
}));

// Mocking logger.error
jest.mock('../services/logger.js', () => ({
  error: jest.fn(),
}));

describe('T1 -- coSupervisorAdd', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T1.1 - should add co-supervisor internally', async () => {
    // Mock the internal teacher query result
    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 1 }],
    });

    // Mock the INSERT INTO THESIS_CO_SUPERVISION query result
    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ /* your expected result */ }],
    });

    const result = await coSupervisorAdd(123, 'John', 'Doe', false);

    expect(result).toBe(0);
    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM TEACHER WHERE name=$1 AND surname=$2',
      values: ['John', 'Doe'],
    });
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('T1.2 - should add co-supervisor externally', async () => {
    // Mock the external co-supervisor query result
    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 2 }],
    });

    // Mock the INSERT INTO THESIS_CO_SUPERVISION query result
    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ /* your expected result */ }],
    });

    const result = await coSupervisorAdd(456, 'Jane', 'Smith', true);

    expect(result).toBe(0);
    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenCalledWith({
      text: 'SELECT * FROM EXTERNAL_CO_SUPERVISOR WHERE name=$1 AND surname=$2',
      values: ['Jane', 'Smith'],
    });
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('T1.3 - should return -1 if the teacher or external co-supervisor is not found', async () => {
    // Mock the query result when no teacher or external co-supervisor is found
    pool.query.mockResolvedValueOnce({
      rowCount: 0,
      rows: [],
    });

    const result = await coSupervisorAdd(789, 'Nonexistent', 'Person', false);

    expect(result).toBe(-1);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});


describe('T2 -- getExtCoSupervisors', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T2.1 - should return external co-supervisors', async () => {
    // Mock the query result for external co-supervisors
    const expectedResults = [
      { name: 'John', surname: 'Doe' },
      { name: 'Jane', surname: 'Smith' },
    ];

    pool.query.mockResolvedValueOnce({
      rowCount: expectedResults.length,
      rows: expectedResults,
    });

    // Mock Express response object
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getExtCoSupervisors(null, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ data: expectedResults });
    expect(pool.query).toHaveBeenCalledWith(
        `SELECT name,surname FROM EXTERNAL_CO_SUPERVISOR;`,
      []
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('T2.2 - should handle errors and return 500 status', async () => {
    // Mock the error scenario
    const mockError = new Error('Database error');

    pool.query.mockRejectedValueOnce(mockError);

    // Mock Express response object
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getExtCoSupervisors(null, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Unknown error occurred' });
    expect(logger.error).toHaveBeenCalledWith(mockError);
  });
});

