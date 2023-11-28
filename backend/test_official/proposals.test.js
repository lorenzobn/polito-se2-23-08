const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Importa il tuo app
const authorize = require('../controllers/auth');
const { createProposal, getProposals, getProposalbyId, getProposalsByTeacher, updateProposal, searchProposal } = require('../controllers/proposals');
const pool = require("../db/connection");
const { coSupervisorAdd, getExtCoSupervisors, getCoSupervisors, keywordsAdd, getKeywords, getCoSupThesis, getECoSupThesis } = require("../controllers/utils");
const { get } = require('mongoose');

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

//createProposal
describe('T1 -- createProposal', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should return 400 if validation fails', async () => {
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

  it('should return 500 if there is an error with cod_group', async () => {
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
        status: 'Test Status',
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

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Error with the cod_group.' });
  });

  it('should return 500 if there is an error inserting the proposal.', async () => {
    // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [{ cod_group: 'AAA1' }],
    });

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
        status: 'Test Status',
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

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: "Error inserting the proposal." });
  });

  // Example: test case for successful proposal creation
  it('should return 201 for a successful proposal creation', async () => {
    // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [{ cod_group: 'AAA1' }],
    });
    
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1 }],
    });
    /*
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1 }],
      rowCount: 1,
      next: jest.fn(),
    });
    */

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
        status: 'Test Status',
        keywords: [],
        coSupervisors: []
      },
      session: {
        user: {
          id: 'supervisorId',
        },
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await createProposal(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Proposal created successfully',
      data: { id: 1 },
    });
  });
});

//getProposals
describe('T2 -- GET /thesis-proposals', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // correct get proposals
  it('T1.1 - Correct get of proposals', async () => {
    // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [{ cod_group: 'AAA1' }],
    });

    const req = {
      body: {
        // Crea un oggetto proposta di prova
      }
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Effettua una richiesta GET alla rotta /thesis-proposals
    await getProposals(req, res);

    // Verifica che la risposta contenga il messaggio di errore
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'OK',
      data: [{ cod_group: "AAA1" }],
    });
  });
});

//getProposalbyId
describe('T3 -- GET /thesis-proposals', () => {
  // error 404, resource not found
  it('T3.1 - Error 404, resource not found', async () => {
    // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    });

    const req = {
      params: {
        proposalId: 1
      }
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

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



    const req = {
      params: {
        proposalId: 1
      }
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

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
describe('T5 -- PUT /thesis-proposals/:proposalId', () => {
  // error 404, resource not found
  it('T5.1 - Error 404, Thesis proposal not found.', async () => {
    // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    });

    const req = {
      params: {
        proposalId: 1
      },
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
        status: 'Test Status',
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

    // Effettua una richiesta PUT alla rotta /thesis-proposals/:proposalId
    await updateProposal(req, res);

    // Verifica che la risposta contenga il messaggio di errore
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Thesis proposal not found.",
    });
  });

});

//searchProposal
describe('T6 -- GET /thesis-proposals/search', () => {
  // correct search proposal
  it('T6.1 - Correct search proposal', async () => {
    // Mocking the pool.query to simulate an error
    pool.query.mockResolvedValueOnce({
      rows: [{ correct: 'correct' }],
    });

    const req = {
      query: {
        // Crea un oggetto proposta di prova
        title: 'Test Proposal 2',
        type: 'Test Type',
        description: 'Test Description',
        required_knowledge: 'Test Knowledge',
        notes: 'Test Notes',
        level: 'BSc',
        programme: 'LM-32',
        deadline: new Date(),
        status: 'Test Status',
        keywords: [],
        coSupervisors: []
      }
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Effettua una richiesta GET alla rotta /thesis-proposals/search
    await searchProposal(req, res);

    // Verifica che la risposta contenga il messaggio di errore
    //expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'OK',
      data: [{ correct: "correct" }],
    });
  });
});
