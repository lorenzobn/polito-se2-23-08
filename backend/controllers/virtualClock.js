const addVirtualClockMIddleware = (req, res, next) => {
  if (!req.session) {
    next();
    return;
  }
  if (!req.session.clock) {
    let clock = {
      modified: false,
      time: new Date(),
    };
    req.session.clock = clock;
    next();
    return;
  }
  if (!req.session.clock.modified) {
    req.session.clock.time = new Date();
    next();
    return;
  }
  // if clock is modified we dont want to update it to current time on each request
  next();
};

const addVirtualClockToResMiddleware = (req, res, next) => {
  if (req?.session?.clock?.time) {
    const originalJson = res.json;

    res.json = function (data) {
      data.virtual_time = req.session.clock.time;

      originalJson.call(res, data);
    };
  }
  next();
};

const setVirtualClock = (req, res, next) => {
  const { time } = req.body;
  console.log(time);
  if (!req.session) {
    return res.status(400).json({ msg: "missing session" });
  }
  if (!req.session.clock) {
    return res.status(400).json({ msg: "missing clock in session" });
  }
  req.session.clock.time = new Date(time);
  req.session.clock.modified = true;
  return res.status(200).json({ msg: "virtual clock is set" });
};

module.exports = {
  setVirtualClock,
  addVirtualClockMIddleware,
  addVirtualClockToResMiddleware,
};
