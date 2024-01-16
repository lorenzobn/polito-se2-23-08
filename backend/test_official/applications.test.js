const pool = require("../db/connection");
const { createApplication, downloadCV } = require("../controllers/applications");
const { createNotification } = require("../controllers/notifications");


jest.mock('../controllers/auth', () => ({
    ...jest.requireActual('../controllers/auth'),
  
    authorize: jest.fn().mockImplementation(() => (req, res, next) => {
      req.user = { role: 'teacher' };
      next();
    }),
  }));

jest.mock('../db/connection', () => ({
    query: jest.fn(),
}));

jest.mock('../controllers/notifications', () => ({
    createNotification: jest.fn()
  }))

//createApplication
describe("createApplication", () => {
    // T2.1 - validation failed
    it('T2.1 - should return 400 if validation fails', async () => {
        const req = {
        body: {
            student_id: 's123',
            //thesis_id: 1,
            thesis_status: 'idle',
            cv_uri: '',
        },
        session: {
            user: {
            id: 's123',
            },
            clock: {
            time: new Date(),
            },
        },
        files: null,
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await createApplication(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({msg: '\"thesis_id\" is required'});
    });

    // T2.2 - Invalid proposal id.
    it('T2.2 - should return 400 if proposal id is invalid', async () => {
        const req = {
        body: {
            student_id: 's123',
            thesis_id: 1,
            thesis_status: 'idle',
            cv_uri: '',
        },
        session: {
            user: {
            id: 's123',
            },
            clock: {
            time: new Date(),
            },
        },
        files: null,
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
    
        pool.query.mockResolvedValueOnce({ 
            rows: [],
            rowCount: 0,
        });

        await createApplication(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({msg: "Invalid proposal id."});
    });

    // T2.3 - Inactive thesis
    it('T2.3 - should return 400 if thesis is inactive', async () => {
        const req = {
        body: {
            student_id: 's123',
            thesis_id: 1,
            thesis_status: 'idle',
            cv_uri: '',
        },
        session: {
            user: {
            id: 's123',
            },
            clock: {
            time: new Date(),
            },
        },
        files: null,
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
    
        pool.query.mockResolvedValueOnce({ 
            rows: [ { status: 'inactive' } ],
            rowCount: 1,
        });

        await createApplication(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({msg: "Cannot apply to this thesis because it is not active anymore."});
    });

    // T2.4 - Invalid proposal id.
    it('T2.4 - should return 400 if proposal id is invalid', async () => {
        const req = {
        body: {
            student_id: 's123',
            thesis_id: 1,
            thesis_status: 'idle',
            cv_uri: '',
        },
        session: {
            user: {
            id: 's123',
            },
            clock: {
            time: new Date(),
            },
        },
        files: null,
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
    
        pool.query.mockResolvedValueOnce({ 
            rows: [],
            rowCount: 0,
        });

        await createApplication(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({msg: "Invalid proposal id."});
    });

    // T2.5 - Inactive thesis
    it('T2.5 - should return 400 if thesis is inactive', async () => {
        const req = {
        body: {
            student_id: 's123',
            thesis_id: 1,
            thesis_status: 'idle',
            cv_uri: '',
        },
        session: {
            user: {
            id: 's123',
            },
            clock: {
            time: new Date(),
            },
        },
        files: null,
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
    
        pool.query.mockResolvedValueOnce({ 
            rows: [ { status: 'active', title: "Title", teacher_id: "T123" } ],
            rowCount: 1,
        });

        pool.query.mockResolvedValueOnce({
            rows: [ { status: 'active' } ],
            rowCount: 1,
        });

        createNotification.mockResolvedValueOnce(null);


        await createApplication(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
    });


});

//downloadCV
describe("downloadCV", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        pool.query.mockClear();
    }
    );

    // T3.1 - Resource not found 1
    it('T3.1 - should return 404 if resource is not found (1)', async () => {
        const req = {
        params: {
            app_id: 1,
        },
        session: {
            user: {
            id: 's123',
            },
            clock: {
            time: new Date(),
            },
        },
        files: null,
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        pool.query.mockResolvedValueOnce({
            rows: [],
            rowCount: 0,
        });

        await downloadCV(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({msg: 'Resource not found'});
    });

    // T3.2 - Resource not found 2
    it('T3.2 - should return 404 if resource is not found (2)', async () => {
        const req = {
        params: {
            app_id: 1,
        },
        session: {
            user: {
            id: 's123',
            },
            clock: {
            time: new Date(),
            },
        },
        files: null,
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            setHeader: jest.fn(),
            download: jest.fn(),
        };

        pool.query.mockResolvedValueOnce({
            rows: [{ cv_uri: null}],
            rowCount: 1,
        });

        await downloadCV(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({msg: 'Resource not found'});

    });

    // T3.3 - success
    it('T3.3 - success', async () => {
        const req = {
        params: {
            app_id: 1,
        },
        session: {
            user: {
            id: 's123',
            },
            clock: {
            time: new Date(),
            },
        },
        files: null,
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            setHeader: jest.fn(),
            download: jest.fn(),
        };

        pool.query.mockResolvedValueOnce({
            rows: [{ cv_uri: true}],
            rowCount: 1,
        });

        await downloadCV(req, res);
    
        expect(res.download).toHaveBeenCalled();

    });
});

