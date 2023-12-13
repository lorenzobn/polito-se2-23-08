const pool = require("../db/connection");
const { coSupervisorAdd, getExtCoSupervisors, getCoSupervisors, keywordsAdd, getKeywords, getCoSupThesis, getECoSupThesis } = require('../controllers/utils'); // Replace 'yourModule' with the actual path to your module
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

describe('T3 -- getCoSupervisors', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T3.1 - should return all teachers when user is not a teacher', async () => {
    // Mock the query result for all teachers
    const expectedResults = [
      { id: 1, name: 'John', surname: 'Doe' },
      { id: 2, name: 'Jane', surname: 'Smith' },
    ];

    pool.query.mockResolvedValueOnce({
      rowCount: expectedResults.length,
      rows: expectedResults,
    });

    // Mock Express request and response objects
    const mockReq = { session: { user: { role: 'student' } } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCoSupervisors(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ data: expectedResults });
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT id,name,surname FROM TEACHER;',
      []
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('T3.2 - should return teachers excluding the logged-in teacher', async () => {
    // Mock the query result for teachers excluding the logged-in teacher
    const expectedResults = [
      { id: 2, name: 'Jane', surname: 'Smith' },
      { id: 3, name: 'Bob', surname: 'Johnson' },
    ];

    pool.query.mockResolvedValueOnce({
      rowCount: expectedResults.length,
      rows: expectedResults,
    });

    // Mock Express request and response objects
    const mockReq = { session: { user: { role: 'teacher', id: 1 } } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCoSupervisors(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ data: expectedResults });
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT id,name,surname FROM TEACHER WHERE id!=$1;',
      [1]
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('T3.3 - should handle errors and return 500 status', async () => {
    // Mock the error scenario
    const mockError = new Error('Database error');

    pool.query.mockRejectedValueOnce(mockError);

    // Mock Express request and response objects
    const mockReq = { session: { user: { role: 'student' } } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCoSupervisors(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Unknown error occurred' });
    expect(logger.error).toHaveBeenCalledWith(mockError);
  });
});

describe('T4 -- keywordsAdd', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T4.1 - should add keywords successfully', async () => {
    // Mock the query result for successful insertion
    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ /* your expected result */ }],
    });

    const result = await keywordsAdd(123, 'Machine Learning', '2023-01-01');

    expect(result).toBe(0);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO KEYWORDS VALUES($1, $2, $3);',
      [123, 'Machine Learning', '2023-01-01']
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('T4.2 - should handle errors and return -1', async () => {
    // Mock the error scenario
    const mockError = new Error('Database error');

    pool.query.mockRejectedValueOnce(mockError);

    const result = await keywordsAdd(456, 'Data Science', '2023-02-01');

    expect(result).toBe(-1);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO KEYWORDS VALUES($1, $2, $3);',
      [456, 'Data Science', '2023-02-01']
    );
    expect(logger.error).toHaveBeenCalledWith(mockError);
  });
});

describe('T5 -- getKeywords', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T5.1 - should return keywords successfully', async () => {
    // Mock the query result for successful retrieval
    const expectedResults = [
      { keyword: 'Machine Learning' },
      { keyword: 'Data Science' },
    ];

    pool.query.mockResolvedValueOnce({
      rowCount: expectedResults.length,
      rows: expectedResults,
    });

    const result = await getKeywords(123);

    expect(result).toEqual(expectedResults);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT keyword FROM KEYWORDS WHERE thesisId=$1;',
      [123]
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('T5.2 - should handle errors and return an empty array', async () => {
    // Mock the error scenario
    const mockError = new Error('Database error');

    pool.query.mockRejectedValueOnce(mockError);

    const result = await getKeywords(456);

    expect(result).toEqual([]);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT keyword FROM KEYWORDS WHERE thesisId=$1;',
      [456]
    );
    expect(logger.error).toHaveBeenCalledWith(mockError);
  });
});

describe('T6 -- getCoSupThesis', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T6.1 - should return internal co-supervisors for a specific thesis successfully', async () => {
    // Mock the query result for successful retrieval
    const expectedResults = [
      { name: 'John', surname: 'Doe' },
      { name: 'Jane', surname: 'Smith' },
    ];

    pool.query.mockResolvedValueOnce({
      rowCount: expectedResults.length,
      rows: expectedResults,
    });

    const result = await getCoSupThesis(123);

    expect(result).toEqual(expectedResults);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT name,surname FROM TEACHER JOIN THESIS_CO_SUPERVISION ON TEACHER.id=THESIS_CO_SUPERVISION.internal_co_supervisor_id WHERE is_external=FALSE AND thesis_proposal_id=$1;',
      [123]
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('T6.2 - should handle errors and return an empty array', async () => {
    // Mock the error scenario
    const mockError = new Error('Database error');

    pool.query.mockRejectedValueOnce(mockError);

    const result = await getCoSupThesis(456);

    expect(result).toEqual([]);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT name,surname FROM TEACHER JOIN THESIS_CO_SUPERVISION ON TEACHER.id=THESIS_CO_SUPERVISION.internal_co_supervisor_id WHERE is_external=FALSE AND thesis_proposal_id=$1;',
      [456]
    );
    expect(logger.error).toHaveBeenCalledWith(mockError);
  });
});

describe('T7 -- getECoSupThesis', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T7.1 - should return external co-supervisors for a specific thesis successfully', async () => {
    // Mock the query result for successful retrieval
    const expectedResults = [
      { name: 'John', surname: 'Doe' },
      { name: 'Jane', surname: 'Smith' },
    ];

    pool.query.mockResolvedValueOnce({
      rowCount: expectedResults.length,
      rows: expectedResults,
    });

    const result = await getECoSupThesis(123);

    expect(result).toEqual(expectedResults);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT name,surname FROM EXTERNAL_CO_SUPERVISOR JOIN THESIS_CO_SUPERVISION ON EXTERNAL_CO_SUPERVISOR.id=THESIS_CO_SUPERVISION.external_co_supervisor_id WHERE is_external=TRUE AND thesis_proposal_id=$1;',
      [123]
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('T7.2 - should handle errors and return an empty array', async () => {
    // Mock the error scenario
    const mockError = new Error('Database error');

    pool.query.mockRejectedValueOnce(mockError);

    const result = await getECoSupThesis(456);

    expect(result).toEqual([]);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT name,surname FROM EXTERNAL_CO_SUPERVISOR JOIN THESIS_CO_SUPERVISION ON EXTERNAL_CO_SUPERVISOR.id=THESIS_CO_SUPERVISION.external_co_supervisor_id WHERE is_external=TRUE AND thesis_proposal_id=$1;',
      [456]
    );
    expect(logger.error).toHaveBeenCalledWith(mockError);
  });
});
