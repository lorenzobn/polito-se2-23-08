const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Importa il tuo app


var token = '';

describe('T1 -- POST /thesis-proposals', () => {

  // Missing token, return 401
  it('T1.1 - Missing token', async () => {
    
    // Crea un oggetto proposta di prova
    const proposal = {
      title: 'Test Proposal',
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
    };

    // Effettua una richiesta POST alla rotta /thesis-proposals
    const response = await request(app)
      .post('/api/v1.0/thesis-proposals')
      .send(proposal);

    // Verifica che la risposta abbia uno status code di 401
    expect(response.statusCode).toBe(401);
    // Verifica che la risposta contenga il messaggio di errore
    expect(response.body.error).toBe('Access denied');
  });

  //Correct creation of proposal, return 201
  it('T1.2 - Correct creation of proposal', async () => {
    // Login as a teacher
    const loginResponse = await request(app)
    .post('/api/v1.0/login')
    .send(
      {
        "email": "bini.enrico@unito.it",
        "password": "t123"
      }
    )
    const token = loginResponse.body.token;

    // Crea un oggetto proposta di prova
    const proposal = {
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
    };

    // Effettua una richiesta POST alla rotta /thesis-proposals
    const response = await request(app)
      .post('/api/v1.0/thesis-proposals')
      .set('auth', token) // Imposta l'header del token
      .send(proposal);

    // Verifica che la risposta abbia uno status code di 201
    //expect(response.statusCode).toBe(201);
    // Verifica che la risposta contenga il messaggio di successo
    expect(response.body.msg).toBe('Proposal created successfully');
    // Verifica che la risposta contenga i dati della proposta
    expect(response.body.data).toHaveProperty('id');
  });

  //Correct creation of proposal with coSupervisors, return 201
  it('T1.3 - Correct creation of proposal with coSupervisors', async () => {
        // Login as a teacher
        const loginResponse = await request(app)
        .post('/api/v1.0/login')
        .send(
          {
            "email": "bini.enrico@unito.it",
            "password": "t123"
          }
        )
        const token = loginResponse.body.token;
        // Crea un oggetto proposta di prova
        const proposal = {
          title: 'Test Proposal 3',
          type: 'Test Type',
          description: 'Test Description',
          requiredKnowledge: 'Test Knowledge',
          notes: 'Test Notes',
          level: 'BSc',
          programme: 'LM-32',
          deadline: new Date(),
          status: 'Test Status',
          keywords: [],
          coSupervisors: [{name: "Enrico", surname: "Bini", isExternal: false}, {name: "Andrea", surname: "Rossi", isExternal: true}]
        };
    
        // Effettua una richiesta POST alla rotta /thesis-proposals
        const response = await request(app)
          .post('/api/v1.0/thesis-proposals')
          .set('auth', token) // Imposta l'header del token
          .send(proposal);
    
        // Verifica che la risposta abbia uno status code di 201
        //expect(response.statusCode).toBe(201);
        // Verifica che la risposta contenga il messaggio di successo
        expect(response.body.msg).toBe('Proposal created successfully');
        // Verifica che la risposta contenga i dati della proposta
        expect(response.body.data).toHaveProperty('id');
  });

  //Correct creation of proposal with keywords, return 201
  it('T1.4 - Correct creation of proposal with keywords', async () => {
      // Login as a teacher
      const loginResponse = await request(app)
      .post('/api/v1.0/login')
      .send(
        {
          "email": "bini.enrico@unito.it",
          "password": "t123"
        }
      )
      const token = loginResponse.body.token;
    // Crea un oggetto proposta di prova
    const proposal = {
      title: 'Test Proposal 4',
      type: 'Test Type',
      description: 'Test Description',
      requiredKnowledge: 'Test Knowledge',
      notes: 'Test Notes',
      level: 'BSc',
      programme: 'LM-32',
      deadline: new Date(),
      status: 'Test Status',
      keywords: ["Test1", "Test2"],
      coSupervisors: []
    };

    // Effettua una richiesta POST alla rotta /thesis-proposals
    const response = await request(app)
      .post('/api/v1.0/thesis-proposals')
      .set('auth', token) // Imposta l'header del token
      .send(proposal);

    // Verifica che la risposta abbia uno status code di 201
    //expect(response.statusCode).toBe(201);
    // Verifica che la risposta contenga il messaggio di successo
    expect(response.body.msg).toBe('Proposal created successfully');
    // Verifica che la risposta contenga i dati della proposta
    expect(response.body.data).toHaveProperty('id');
});

  //Missing title, return 400  (it can beany other missing field)
  it('T1.5 - Missing title', async () => {
     // Login as a teacher
    const loginResponse = await request(app)
    .post('/api/v1.0/login')
    .send(
      {
        "email": "bini.enrico@unito.it",
        "password": "t123"
      }
    )
    const token = loginResponse.body.token;
    // Crea un oggetto proposta di prova
    const proposal = {
      type: 'Test Type 7',
      description: 'Test Description',
      requiredKnowledge: 'Test Knowledge',
      notes: 'Test Notes',
      level: 'BSc',
      programme: 'LM-32',
      deadline: new Date(),
      status: 'Test Status',
      keywords: [],
      coSupervisors: []
    };

    // Effettua una richiesta POST alla rotta /thesis-proposals
    const response = await request(app)
      .post('/api/v1.0/thesis-proposals')
      .set('auth', token) // Imposta l'header del token
      .send(proposal);

    // Verifica che la risposta abbia uno status code di 201
    expect(response.statusCode).toBe(400);
    // Verifica che la risposta contenga il messaggio di successo
    expect(response.body.msg).toBe('"title" is required');
  }); 

  //Error with the COD_GROUP, return 500, don't know how to implement, coverage not 100%

  //Error inserting the proposal, return 500, don't know how to implement, coverage not 100%
});

describe('T2 -- GET /thesis-proposals', () => {
  // Missing token, return 401
  it('T1.1 - Correct get of proposals', async () => {
    // Effettua una richiesta GET alla rotta /thesis-proposals
    const response = await request(app)
      .get('/api/v1.0/thesis-proposals');

    // Verifica che la risposta abbia uno status code di 401
    expect(response.statusCode).toBe(200);
    // Verifica che la risposta contenga il messaggio di errore
    //expect(response.body).toBe('check content response');
  });
});

describe('T3 -- GET /thesis-proposals', () => {
  //pass poposal id as parameter, return 200
  it('T3.1 - Correct get of proposal by id', async () => {
    // Login as a teacher
    const loginResponse = await request(app)
    .post('/api/v1.0/login')
    .send(
      {
        "email": "bini.enrico@unito.it",
        "password": "t123"
      }
    )
    const token = loginResponse.body.token;
    // Effettua una richiesta GET alla rotta /thesis-proposals
    const response = await request(app)
      .get('/api/v1.0/thesis-proposals/1')
      .set('auth', token); // Imposta l'header del token

    // Verifica che la risposta abbia uno status code di 401
    expect(response.statusCode).toBe(200);
    // Verifica che la risposta contenga il messaggio di errore
    expect(response.body.data[0].id).toBe(1);
  });

  //pass wrong proposal id as parameter, return 404
  it('T3.2 - Wrong get of proposal by id', async () => {
    // Login as a teacher
    const loginResponse = await request(app)
    .post('/api/v1.0/login')
    .send(
      {
        "email": "bini.enrico@unito.it",
        "password": "t123"
      }
    )
    const token = loginResponse.body.token;
    // Effettua una richiesta GET alla rotta /thesis-proposals
    const response = await request(app)
      .get('/api/v1.0/thesis-proposals/-1')
      .set('auth', token); // Imposta l'header del token

    // Verifica che la risposta abbia uno status code di 401
    expect(response.statusCode).toBe(404);
    // Verifica che la risposta contenga il messaggio di errore
    expect(response.body.msg).toBe("Resource not found");
  })
});
