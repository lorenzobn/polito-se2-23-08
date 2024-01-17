const pool = require("../db/connection");
const { createApplication, downloadCV, getApplications, getApplicationById, updateApplication, cancellApplicationsForThesis, getReceivedApplications, getReceivedApplicationsByThesisId, didStudentApply, archiveProposal } = require("../controllers/applications");
const { createNotification } = require("../controllers/notifications");
const { userRoles } = require("../controllers/auth");


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

beforeEach(() => {
    jest.clearAllMocks();
    pool.query.mockClear();
});

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

//getApplications
describe("getApplications", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        pool.query.mockClear();
    }
    );

    // T4.1 - success
    it('T4.1 - success', async () => {
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

        await getApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

    });
});

//getApplicationById
describe("getApplicationById", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        pool.query.mockClear();
    });


    // T5.1 - resource not found
    it('T5.1 - resource not found', async () => {
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
        clock: {
            time: new Date(),
        },
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            setHeader: jest.fn(),
            download: jest.fn(),
        };

        pool.query.mockResolvedValueOnce({
            rows: [],
            rowCount: 0,
        });

        await getApplicationById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

    });

    // T5.2 - success
    it('T5.2 - success', async () => {
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
        clock: {
            time: new Date(),
        },
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

        await getApplicationById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

    });
});

//updateApplication
describe("updateApplication", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        pool.query.mockClear();
    });

    //T.6.1 - Unauthorized
    it('T6.1 - should return 401 if user is unauthorized', async () => {
        const req = {
        body: {
            status: 'accepted',
        },
        params: {
            applicationId: 1,
        },
        session: {
            user: {
            id: 's123',
            role: userRoles.student,
            },
            clock: {
            time: new Date(),
            },
        },
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await updateApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({msg: 'Unauthorized'});
    });

    //T.6.2 - Application or valid proposal not found.
    it('T6.2 - should return 404 if application or valid proposal not found', async () => {
        const req = {
        body: {
            status: 'accepted',
        },
        params: {
            applicationId: 1,
        },
        session: {
            user: {
            id: 's123',
            role: userRoles.teacher,
            },
            clock: {
            time: new Date(),
            },
        },
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        pool.query.mockResolvedValueOnce({
            rows: [],
            rowCount: 0,
        });

        await updateApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({msg: 'Application or valid proposal not found.'});
    });

    //T.6.3 - Cannot update this application because it has already been accepted/rejected.
    it('T6.3 - Cannot update this application because it has already been accepted/rejected.', async () => {
        const req = {
        body: {
            status: 'accepted',
        },
        params: {
            applicationId: 1,
        },
        session: {
            user: {
            id: 's123',
            role: userRoles.teacher,
            },
            clock: {
            time: new Date(),
            },
        },
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        pool.query.mockResolvedValueOnce({
            rows: [{ status: 'accepted' }],
            rowCount: 1,
        });

        await updateApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({msg: 'Cannot update this application because it has already been accepted/rejected.'});
    });

    //T.6.4 - validation error
    it('T6.4 - Validation error', async () => {
        const req = {
        body: {
            status: 'notValid',
        },
        params: {
            applicationId: 1,
        },
        session: {
            user: {
            id: 's123',
            role: userRoles.teacher,
            },
            clock: {
            time: new Date(),
            },
        },
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        pool.query.mockResolvedValueOnce({
            rows: [{ status: 'idle', thesos_id: 1, title: 'Title'}],
            rowCount: 1,
        });

        await updateApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({msg: '\"status\" must be one of [accepted, rejected]'});
    });

    /*
    //T.6.5 - No valid fields provided for update.
    it('T6.5 - No valid fields provided for update.', async () => {
        const req = {
        body: {
            status: 'accepted',
        },
        params: {
            applicationId: 1,
        },
        session: {
            user: {
            id: 's123',
            role: userRoles.teacher,
            },
            clock: {
            time: new Date(),
            },
        },
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        pool.query.mockResolvedValueOnce({
            rows: [{ status: 'idle', thesos_id: 1, title: 'Title'}],
            rowCount: 1,
        });
        pool.query.mockResolvedValueOnce({
            rows: [{ status: 'idle', thesos_id: 1, title: 'Title'}],
            rowCount: 1,
        });
        pool.query.mockResolvedValueOnce({
            rows: [{ status: 'idle', thesos_id: 1, title: 'Title'}],
            rowCount: 1,
        });

        await updateApplication(req, res);

        //expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({msg: 'Application not found.'});
    });
    */
});

//cancellApplicationForThesis
describe("cancellApplicationForThesis", () => {
    
        beforeEach(() => {
            jest.clearAllMocks();
            pool.query.mockClear();
        });
    
        //T.7.1 - Unauthorized
        it('T7.1 - should return 401 if user is unauthorized', async () => {

            pool.query.mockResolvedValueOnce({
                rows: [{ status: 'idle', thesos_id: 1, title: 'Title'}],
                rowCount: 1,
            });
    
            let res = await cancellApplicationsForThesis("t1", "Title", new Date(), "123");
    
            expect(res).toEqual(0);
        });
});

//getReceivedApplications
describe("getReceivedApplications", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        pool.query.mockClear();
    });

    //T.8.1 - success
    it('T8.1 - success', async () => {
        const req = {
        params: {
            app_id: 1,
        },
        session: {
            user: {
            id: 's123',
            role: userRoles.teacher,
            },
            clock: {
            time: new Date(),
            },
        },
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

        await getReceivedApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

    });
});

//getReceivedApplicationsByThesisId
describe("getReceivedApplicationsByThesisId", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        pool.query.mockClear();
    });

    //T.9.1 - success
    it('T9.1 - success', async () => {
        const req = {
        params: {
            app_id: 1,
        },
        session: {
            user: {
            id: 's123',
            role: userRoles.teacher,
            },
            clock: {
            time: new Date(),
            },
        },
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

        await getReceivedApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
});

//didStudentApply
describe("didStudentApply", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        pool.query.mockClear();
    });

    //T.10.1 - success
    it('T10.1 - success', async () => {
        const req = {
        params: {
            app_id: 1,
        },
        session: {
            user: {
            id: 's123',
            role: userRoles.teacher,
            },
            clock: {
            time: new Date(),
            },
        },
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

        await getReceivedApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
});

//archiveProposal
describe("archiveProposal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        pool.query.mockClear();
    });

    //T.11.1 - success
    it('T11.1 - success', async () => {


        pool.query.mockResolvedValueOnce({
            rows: [{ cv_uri: true}],
            rowCount: 1,
        });

        let res = await archiveProposal("t123", new Date());

        expect(res).toEqual(0);
    });
});


