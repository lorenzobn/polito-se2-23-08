const { createNotification, getNotificationsByUserId, markNotificationAsSeen } = require('../controllers/notifications'); // Replace 'yourModule' with the actual path to your module
const { userTypes } = require('../controllers/users')
const pool = require("../db/connection");
const { sendEmail  } = require("../controllers/email");

jest.mock('../db/connection', () => ({
  query: jest.fn(),
}));

jest.mock('../controllers/email', () => ({
  sendEmail: jest.fn(),
}));

describe('T1 -- createNotification Tests', () => {

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('T1.1 - should create a notification when no email is provided (student)', async () => {
        
        pool.query.mockResolvedValueOnce({rows: [{message: "message"}]})

        const result = await createNotification("s123", userTypes.student, "notificationTitle with more than 200 characters  dnkjnfdsnskdndksnfkdnscdsncnkjdncknscdjckjsdncjkndscjdnkcjnskndkjcnksjbhjbeiyfbuehfnsdjncjkndskjndbhbfiudsbcubsobcdshudbcblsdbckjdbnkhbdhhbdcbsdbkcdnjsdkjnsdnljcn", "a new message for you! with more than 200 characters  nfcdskjcndkusknuscdkcdjsicsnusueiecsdkndcsjndskndcbdniuhhuecouniojsodicjndjnsdkjndsksduoewhcnsdlcnlsdniuhdeiufowvcuesscbeoiudhjishoiebncoisehoecneshjdhieushe");
        
        expect(result).toEqual({message: "message"}) 
    });

    it('T1.2 - should create a notification when email is provided (student)', async () => {
        
        pool.query.mockResolvedValueOnce({rows: [{message: "message"}]})
        pool.query.mockResolvedValueOnce({rows: [{message: "message", email: "email@gmail.com"}]})
        sendEmail.mockResolvedValueOnce(null)

        const result = await createNotification("s123", userTypes.student, "notificationTitle", "a new message for you!", "mail@gmail.com");
  
        expect(result).toEqual({message: "message"}) 
    });

    it('T1.3 - should create a notification when email is provided (student)', async () => {
        
        pool.query.mockResolvedValueOnce({rows: [{message: "message"}]})
        pool.query.mockResolvedValueOnce({rows: []})
        sendEmail.mockResolvedValueOnce(null)

        const result = await createNotification("s123", userTypes.teacher, "notificationTitle", "a new message for you!", "mail@gmail.com");
  
        expect(result).toEqual({message: "message"}) 
    });



});


describe('T2 -- getNotificationsByUserId Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T2.1 - should get notifications for a teacher', async () => {
    const req = {
      session: {
        user: {
          id: 123,
          role: userTypes.teacher,
        },
        clock: {
          time: new Date('2023-01-01T12:00:00Z'),
        },
      },
    };

    const expectedQuery = {
      text: expect.any(String),
      values: [123, req.session.clock.time],
    };

    pool.query.mockResolvedValueOnce({ rows: [{}] });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getNotificationsByUserId(req, res);

    expect(pool.query).toHaveBeenCalledWith(expectedQuery);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [{}] });
  });

  it('T2.2 - should get notifications for a student', async () => {
    const req = {
      session: {
        user: {
          id: 456,
          role: userTypes.student,
        },
        clock: {
          time: new Date('2023-01-01T12:00:00Z'),
        },
      },
    };

    const expectedQuery = {
      text: expect.any(String),
      values: [456, req.session.clock.time],
    };

    pool.query.mockResolvedValueOnce({ rows: [{}] });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getNotificationsByUserId(req, res);

    expect(pool.query).toHaveBeenCalledWith(expectedQuery);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [{}] });
  });

  it('T2.3 - should handle errors when querying the database', async () => {
    const req = {
      session: {
        user: {
          id: 789,
          role: userTypes.teacher,
        },
        clock: {
          time: new Date('2023-01-01T12:00:00Z'),
        },
      },
    };

    const expectedQuery = {
      text: expect.any(String),
      values: [789, req.session.clock.time],
    };

    const errorMock = new Error('Database error');
    pool.query.mockRejectedValueOnce(errorMock);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getNotificationsByUserId(req, res);

    expect(pool.query).toHaveBeenCalledWith(expectedQuery);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'error on getting notifications' });
  });
});

describe('T3 -- markNotificationAsSeen Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('T3.1 - should mark a notification as seen', async () => {
    const req = {
      params: {
        id: 123,
      },
    };

    const expectedQuery = {
      text: expect.any(String),
      values: [123],
    };

    pool.query.mockResolvedValueOnce({ rows: [{}] });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await markNotificationAsSeen(req, res);

    expect(pool.query).toHaveBeenCalledWith(expectedQuery);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: 'done' });
  });

  it('T3.2 - should handle errors when querying the database', async () => {
    const req = {
      params: {
        id: 456,
      },
    };

    const expectedQuery = {
      text: expect.any(String),
      values: [456],
    };

    const errorMock = new Error('Database error');
    pool.query.mockRejectedValueOnce(errorMock);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await expect(markNotificationAsSeen(req, res)).rejects.toThrow(errorMock);

    expect(pool.query).toHaveBeenCalledWith(expectedQuery);
  });
});


  

