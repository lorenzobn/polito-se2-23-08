const request = require('supertest');
const jwt = require('jsonwebtoken');
const authorize = require('../controllers/auth');
const { createProposal, getProposals, getProposalbyId, getProposalsByTeacher, updateProposal, searchProposal } = require('../controllers/proposals');
const pool = require("../db/connection");
const { coSupervisorAdd, getExtCoSupervisors, getCoSupervisors, keywordsAdd, getKeywords, getCoSupThesis, getECoSupThesis } = require("../controllers/utils");
const { get } = require('mongoose');
const utils = require('../controllers/utils');

jest.mock('../controllers/auth', () => ({
  ...jest.requireActual('../controllers/auth'),

  authorize: jest.fn().mockImplementation(() => (req, res, next) => {
    req.user = { role: 'teacher' };
    next();
  }),
}));

jest.mock('../controllers/utils', () => ({  
  ...jest.requireActual('../controllers/utils'),

  coSupervisorAdd: jest.fn(),
  getExtCoSupervisors: jest.fn(),
  getCoSupervisors: jest.fn(),
  keywordsAdd: jest.fn(),
  getKeywords: jest.fn(),
  getCoSupThesis: jest.fn(),
  getECoSupThesis: jest.fn(),
}));



jest.mock('../db/connection', () => ({
  query: jest.fn(),
}));

//createProposal, 8 test cases, DONE
//TO DO : test case to check the deadline
describe('T1 -- createProposal', () => {

  afterEach(() => {
    // Interrompi le operazioni asincrone qui
    jest.clearAllMocks();
  });

  //T1.1 - body is empty
  it('T1.1 - should return 400 if validation fails', async () => {
    const req = {
      body: {
        // Provide invalid data here to trigger validation error
      },
      session: {
        user: {
          id: 't123',
        },
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await createProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  //T1.2 - the supervisor must not be the same as the co-supervisor
  it('T1.2 - should return 400 if the supervisor must not be the same as the co-supervisor', async () => {
    const req = {
      body: {
        // Crea un oggetto proposta di prova
        title: 'Test Proposal 2',
        type: 'Test Type',
        description: 'Test Description',
        requiredKnowledge: 'Test Knowledge',
        notes: 'Test Notes',
        level: 'BSc',
        programme: 'LM-32',
        deadline: new Date(),

        keywords: [],
        coSupervisors: [{id: "t123", external: false}]
      },
      session: {
        user: {
          id: 't123',
        },
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await createProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'The supervisor must not be also a cosupervisor.' });
  });

  //T1.3 - error with cod_degree
  it('T1.3 - should return 400 if there is an error with cod_degree', async () => {
    // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce(false);

    const req = {
      body: {
        // Crea un oggetto proposta di prova
        title: 'Test Proposal 2',
        type: 'Test Type',
        description: 'Test Description',
        requiredKnowledge: 'Test Knowledge',
        notes: 'Test Notes',
        level: 'BSc',
        programme: 'LM-32',
        deadline: new Date(),
        keywords: [],
        coSupervisors: []
      },
      session: {
        user: {
          id: 't123',
        },
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await createProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Programme/CdS provided.' });
  });

  //T1.4 - error with cod_group
  it('T1.4 - should return 400 if there is an error with cod_group', async () => {
    const req = {
      body: {
        // Crea un oggetto proposta di prova
        title: 'Test Proposal 2',
        type: 'Test Type',
        description: 'Test Description',
        requiredKnowledge: 'Test Knowledge',
        notes: 'Test Notes',
        level: 'BSc',
        programme: 'LM-32',
        deadline: new Date(),
        keywords: [],
        coSupervisors: []
      },
      session: {
        user: {
          id: 't123',
        },
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mocking
    pool.query.mockResolvedValueOnce(true);
    pool.query.mockResolvedValueOnce(false);


    await createProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid group provided.' });
  });

  //T1.5 - error with the insertion of the proposal into the database
  it('T1.5 - should return 500 if there is an error inserting the proposal.', async () => {

    const req = {
      body: {
        // Crea un oggetto proposta di prova
        title: 'Test Proposal 2',
        type: 'Test Type',
        description: 'Test Description',
        requiredKnowledge: 'Test Knowledge',
        notes: 'Test Notes',
        level: 'BSc',
        programme: 'LM-32',
        deadline: new Date(),
        keywords: [],
        coSupervisors: []
      },
      session: {
        user: {
          id: 't123',
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

    // Mocking
    pool.query.mockResolvedValueOnce(true);
    pool.query.mockResolvedValueOnce({
      rows: [{ cod_group: 'AAA1' }],
    });
    pool.query.mockResolvedValueOnce(null); //await pool.query('BEGIN');
    pool.query.mockResolvedValueOnce(false);

    await createProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: "Error inserting the proposal." });
  });

  //T1.6 - error with the insertion of the cosupervisors into the database
  it('T1.6 - should return 500 if there is an error with the insertion of the cosupervisors into the database.', async () => {

      const req = {
        body: {
          // Crea un oggetto proposta di prova
          title: 'Test Proposal 2',
          type: 'Test Type',
          description: 'Test Description',
          requiredKnowledge: 'Test Knowledge',
          notes: 'Test Notes',
          level: 'BSc',
          programme: 'LM-32',
          deadline: new Date(),
          keywords: [],
          coSupervisors: [{id: "t124", external: false}, {id: "t125", external: true}]
        },
        session: {
          user: {
            id: 't123',
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

      //mocking functions
      // Mocking
      pool.query.mockResolvedValueOnce(true);
      pool.query.mockResolvedValueOnce({
        rows: [{ cod_group: 'AAA1' }],
      });
      pool.query.mockResolvedValueOnce(null); //await pool.query('BEGIN');
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 'idProposal' }],
      });
      coSupervisorAdd.mockResolvedValueOnce(1);
      coSupervisorAdd.mockResolvedValueOnce(-1);

      await createProposal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "Error during the insertion of the cosupervisors." });
  });

  //T1.7 - error with the insertion of the keywords into the database 
  it('T1.7 - should return 500 if there is an error with the insertion of the keywords into the database.', async () => {
      const req = {
        body: {
          // Crea un oggetto proposta di prova
          title: 'Test Proposal 2',
          type: 'Test Type',
          description: 'Test Description',
          requiredKnowledge: 'Test Knowledge',
          notes: 'Test Notes',
          level: 'BSc',
          programme: 'LM-32',
          deadline: new Date(),
          keywords: ["science", "maths"],
          coSupervisors: [{id: "t124", external: false}, {id: "t125", external: true}]
        },
        session: {
          user: {
            id: 't123',
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

      // Mocking
      pool.query.mockResolvedValueOnce(true);
      pool.query.mockResolvedValueOnce({
        rows: [{ cod_group: 'AAA1' }],
      });
      pool.query.mockResolvedValueOnce(null); //await pool.query('BEGIN');
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 'idProposal' }],
      });
      coSupervisorAdd.mockResolvedValueOnce(1);
      coSupervisorAdd.mockResolvedValueOnce(1);
      keywordsAdd.mockResolvedValueOnce(1);
      keywordsAdd.mockResolvedValueOnce(-1);


      await createProposal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "Error during the insertion of the keywords." });
  });

  //T1.8 - correct creation of the proposal
  it('T1.8 - should return 201, correct creation of the proposal', async () => {
     
    const req = {
      body: {
        // Crea un oggetto proposta di prova
        title: 'Test Proposal 2',
        type: 'Test Type',
        description: 'Test Description',
        requiredKnowledge: 'Test Knowledge',
        notes: 'Test Notes',
        level: 'BSc',
        programme: 'LM-32',
        deadline: new Date(),
        keywords: ["kword1", "kword2"],
        coSupervisors: [{id: "t124", external: false}, {id: "t125", external: true}]
      },
      session: {
        user: {
          id: 't123',
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

    // Mocking
    pool.query.mockResolvedValueOnce(true);
    pool.query.mockResolvedValueOnce({
      rows: [{ cod_group: 'AAA1' }],
    });
    pool.query.mockResolvedValueOnce(null); //await pool.query('BEGIN');
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 'idProposal' }],
    });
    coSupervisorAdd.mockResolvedValueOnce(1);
    coSupervisorAdd.mockResolvedValueOnce(1);
    keywordsAdd.mockResolvedValueOnce(1);
    keywordsAdd.mockResolvedValueOnce(1);
    pool.query.mockResolvedValueOnce(null); //await pool.query('COMMIT');

    await createProposal(req, res);

    //expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({data: {id: 'idProposal' }, msg: "Proposal created successfully" });
  });

});

//getProposals
describe('T2 -- getProposals', () => {

  afterEach(() => {
    // Interrompi le operazioni asincrone qui
    jest.clearAllMocks();
  });

  //correct get proposals called by Professor
  it('T2.1 - Correct get of proposals from Professor', async () => {
    
    const req = {
      body: {
        // Crea un oggetto proposta di prova
      },
      session: {
        user: {
          id: 't123',
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

      // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [{ cod_group: 'AAA1' }],
    });

    // Effettua una richiesta GET alla rotta /thesis-proposals
    await getProposals(req, res);

    // Verifica che la risposta contenga il messaggio di errore
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'OK',
      data: [{ cod_group: "AAA1" }],
    });
  });

  // correct get proposals called by student
  it('T2.2 - Correct get of proposals from Student', async () => {
    
    const req = {
      body: {
        // Crea un oggetto proposta di prova
      },
      session: {
        user: {
          id: 't123',
          role: 'student'
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

      // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [{ cod_group: 'AAA1' }],
    });

    // Effettua una richiesta GET alla rotta /thesis-proposals
    await getProposals(req, res);

    // Verifica che la risposta contenga il messaggio di errore
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'OK',
      data: [{ cod_group: "AAA1" }],
    });
  });

  // correct get proposals
  it('T2.3 - Correct get of proposals from Professor', async () => {
    
    const req = {
      body: {
        // Crea un oggetto proposta di prova
      },
      session: {
        user: {
          id: 't123',
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

    // Mocking the pool.query to simulate the throwing of an error
    pool.query.mockRejectedValueOnce(new Error('Error'));

    // Effettua una richiesta GET alla rotta /thesis-proposals
    await getProposals(req, res);

    // Verifica che la risposta contenga il messaggio di errore
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Error',
    });
  });
});

//getProposalbyId
//TO DO : 
// • (?) test case to check the deadline
// • test case to check the correct get of the keywords
// • test case to check the correct get of the co-supervisors
// • test case to check the correct get of the external co-supervisors
describe('T3 -- getProposalbyId', () => {

  afterEach(() => {
    // Interrompi le operazioni asincrone qui
    jest.clearAllMocks();
  });

  // error 404, resource not found
  it('T3.1 - Error 404, resource not found', async () => {

    const req = {
      params: {
        proposalId: 1
      },
      session: {
        user: {
          id: 't123',
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

    // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    });

    // Effettua una richiesta GET alla rotta /thesis-proposals
    await getProposalbyId(req, res);

    // Verifica che la risposta contenga il messaggio di errore
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Resource not found',
    });
  });

  // correct get proposal by id
  it('T3.2 - Correct get proposal by id', async () => {

    const req = {
      params: {
        proposalId: 1
      },
      session: {
        user: {
          id: 't123',
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

    // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [{ cod_group: 'AAA1' }],
      rowCount: 1,
    });

    const key = ["tonno"]
    const CoSup = [{ id: "1", name: "Mario", surname: "Rossi" }]
    const ECoSup = [{ id: "2", name: "Mario", surname: "Verdi" }]
    getKeywords.mockResolvedValueOnce(key);
    getCoSupThesis.mockResolvedValueOnce(CoSup);
    getECoSupThesis.mockResolvedValueOnce(ECoSup);

    // Effettua una richiesta GET alla rotta /thesis-proposals
    await getProposalbyId(req, res);

    // Verifica che la risposta contenga il messaggio di errore
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'OK',
      data: [{ cod_group: "AAA1" }],
      keywords: key,
      external_co: ECoSup,
      internal_co: CoSup,

    });
  });
});

//getProposalsByTeacher
describe('T4 -- GET /my-thesis-proposals', () => {

  afterEach(() => {
    // Interrompi le operazioni asincrone qui
    jest.clearAllMocks();
  });

  // correct get proposals by teacher
  it('T4.1 - Correct get proposals by teacher', async () => {
    // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [{ correct: 'correct' }],
    });

    const req = {
      session: {
        user: {
          id: 'teacherId',
        },
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Effettua una richiesta GET alla rotta /my-thesis-proposals
    await getProposalsByTeacher(req, res);

    // Verifica che la risposta contenga il messaggio di errore
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'OK',
      data: [{ correct: "correct" }],
    });
  });

  // error 404, resource not found
  it('T4.2 - Error 404, resource not found', async () => {
    // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    });

    const req = {
      session: {
        user: {
          id: 'teacherId',
        },
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Effettua una richiesta GET alla rotta /my-thesis-proposals
    await getProposalsByTeacher(req, res);

    // Verifica che la risposta contenga il messaggio di errore
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Resource not found',
    });
  });
});

//updateProposal
describe('T5 -- updateProposal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // T5.1 - Successfully update proposal
  it('T5.1 - should return 200 and updated proposal', async () => {
    const req = {
      params: {
        proposalId: 'someProposalId',
      },
      session: {
        clock: {
          time: new Date(),
        },
      },
      body: {
        // Provide valid fields to update
        title: 'Updated Title',
        type: 'Updated Type',
        description: 'Updated Description',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mocking pool.query to simulate a successful update
    pool.query.mockResolvedValueOnce({
      rows: [{ /* Updated proposal data */ }],
    });

    await updateProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Thesis proposal updated successfully',
      data: expect.any(Object),
    });
  });

  // T5.2 - Proposal not found
  it('T5.2 - should return 404 if proposal not found', async () => {
    const req = {
      params: {
        proposalId: 'nonExistentProposalId',
      },
      session: {
        clock: {
          time: new Date(),
        },
      },
      body: {
        // Provide valid fields to update
        title: 'Updated Title',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mocking pool.query to simulate proposal not found
    pool.query.mockResolvedValueOnce({
      rows: [],
    });

    await updateProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Thesis proposal not found.' });
  });

  // T5.3 - No valid fields provided for update
  it('T5.3 - should return 400 if no valid fields provided for update', async () => {
    const req = {
      params: {
        proposalId: 'someProposalId',
      },
      session: {
        clock: {
          time: new Date(),
        },
      },
      body: {
        // Do not provide any valid fields to update
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await updateProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'No valid fields provided for update.' });
  });

  // T5.4 - Unknown error occurred during update
  it('T5.4 - should return 500 if unknown error occurred during update', async () => {
    const req = {
      params: {
        proposalId: 'someProposalId',
      },
      session: {
        clock: {
          time: new Date(),
        },
      },
      body: {
        // Provide valid fields to update
        title: 'Updated Title',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mocking pool.query to simulate an unknown error during update
    pool.query.mockRejectedValueOnce(new Error('Unknown error'));

    await updateProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Unknown error occurred' });
  });
});

// SearchProposal
describe('T6 -- searchProposal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // T6.1 - Successfully find proposals
  it('T6.1 - should return 200 and found proposals', async () => {
    const req = {
      query: {
        // Provide search criteria
        title: 'Test',
        type: 'Type',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mocking pool.query to simulate finding proposals
    pool.query.mockResolvedValueOnce({
      rowCount: 2,
      rows: [
        { /* Proposal data 1 */ },
        { /* Proposal data 2 */ },
      ],
    });

    await searchProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'OK',
      data: expect.any(Array),
    });
  });

  // T6.2 - Resource not found
  it('T6.2 - should return 404 if no proposals found', async () => {
    const req = {
      query: {
        // Provide search criteria
        title: 'Nonexistent',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mocking pool.query to simulate no proposals found
    pool.query.mockResolvedValueOnce({
      rowCount: 0,
      rows: [],
    });

    await searchProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Resource not found' });
  });

  // T6.3 - Unknown error occurred during search
  it('T6.3 - should return 500 if unknown error occurred during search', async () => {
    const req = {
      query: {
        // Provide search criteria
        title: 'Test',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mocking pool.query to simulate an unknown error during search
    pool.query.mockRejectedValueOnce(new Error('Unknown error'));

    await searchProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Unknown error occurred' });
  });
});

