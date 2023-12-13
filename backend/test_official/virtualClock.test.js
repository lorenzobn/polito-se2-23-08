const { addVirtualClockMIddleware, addVirtualClockToResMiddleware, setVirtualClock } = require('../controllers/virtualClock'); // Replace 'yourModule' with the actual path to your module

describe('T1 -- addVirtualClock Tests', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { session: null };
    res = {};
    next = jest.fn();
  });

  it('T1.1 - should not update virtual clock when session is missing', () => {
    addVirtualClockMIddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.session).toBeNull();
  });

  it('T1.2 - should set virtual clock in session when clock is missing', () => {
    req.session = {};
    addVirtualClockMIddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.session.clock).toBeDefined();
    expect(req.session.clock.modified).toBe(false);
    expect(req.session.clock.time).toBeInstanceOf(Date);
  });

  it('T1.3 - should update virtual clock time when clock is present and not modified', () => {
    const currentTime = new Date('2022-01-01T12:00:00Z');
    req.session = { clock: { modified: false, time: currentTime } };
    addVirtualClockMIddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.session.clock.modified).toBe(false);
    expect(req.session.clock.time).not.toBe(currentTime);
    expect(req.session.clock.time).toBeInstanceOf(Date);
  });

  it('T1.4 - should skip updating virtual clock time when clock is already modified', () => {
    const currentTime = new Date('2022-01-01T12:00:00Z');
    req.session = { clock: { modified: true, time: currentTime } };
    addVirtualClockMIddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.session.clock.modified).toBe(true);
    expect(req.session.clock.time).toBe(currentTime);
  });
});

describe('T2 -- setVirtualClock Tests', () => {

  it('T2.1 - should set virtual clock when session and clock are present', () => {
    const req = {
      body: { time: '2023-01-01T12:00:00Z' },
      session: { clock: { modified: false, time: new Date() } },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    setVirtualClock(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: 'virtual clock is set' });
    expect(req.session.clock.modified).toBe(true);
  });

  it('T2.2 - should return 400 and "missing session" when session is missing', () => {
    const req = { body: { time: '2023-01-01T12:00:00Z' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    setVirtualClock(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'missing session' });
  });

  it('T2.3 - should return 400 and "missing clock in session" when clock is missing', () => {
    const req = { body: { time: '2023-01-01T12:00:00Z' }, session: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    setVirtualClock(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'missing clock in session' });
  });
});


