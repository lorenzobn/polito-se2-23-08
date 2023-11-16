const request = require('supertest');
const app = require('../app'); //

describe('Proposal API', () => {
  // Assuming there's a valid professor and co-supervisor ID in DB
  const validProfessorId = 'validProfessorId';
  const validCoSupervisorId = 'validCoSupervisorId';

  // T.2 Insert Proposal
  describe('T.2 Insert Proposal', () => {
    // T.2.1 Valid Proposal Insertion
    test('T.2.1 Valid Proposal Insertion', async () => {
      const response = await request(app)
        .post('/proposals')
        .send({
          title: 'AI in Autonomous Vehicles',
          SUPERVISOR_id: validProfessorId,
          coSupervisors: [{ id: validCoSupervisorId, isExternal: true }],
          type: 'Practical Based',
          groups: 'AI and Data Science',
          description: 'This thesis explores the implementation of AI in autonomous vehicles, focusing on machine learning algorithms.',
          requiredKnowledge: 'Machine Learning, Computer Vision',
          notes: 'Please submit a brief overview of your relevant experience.',
          level: "Master's",
          programme: 'Computer Engineering',
          deadline: '2023-12-31', // Assuming a random date
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.msg).toBe('Proposal created successfully');
      expect(response.body.data).toHaveProperty('id');
    });

    // T.2.2 Invalid Supervisor ID
    test('T.2.2 Invalid Supervisor ID', async () => {
      const response = await request(app)
        .post('/proposals')
        .send({
          title: 'Blockchain in Supply Chain',
          SUPERVISOR_id: 'invalidProfessorId',
          coSupervisors: [{ id: validCoSupervisorId, isExternal: true }],
          // Adding valid points.
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe('Invalid Supervisor ID.');
    });

    // T.2.3 Missing Required Fields
    test('T.2.3 Missing Required Fields', async () => {
      const response = await request(app)
        .post('/proposals')
        .send({
          // Missing required fields
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toBe('Title is required.');
    });

    // T.2.4 Expired Deadline
    test('T.2.4 Expired Deadline', async () => {
      const response = await request(app)
        .post('/proposals')
        .send({
          title: 'Renewable Energy Solutions',
          SUPERVISOR_id: validProfessorId,
          coSupervisors: [{ id: validCoSupervisorId, isExternal: true }],
          // Add other valid inputs
          deadline: '2020-01-01', // Replace with a past date/or current date
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.msg).toBe('Proposal created successfully');
      expect(response.body.data.status).toBe('Archived');
    });

  });

  // T.3 Search Proposal
  describe('T.3 Search Proposal', () => {
    // T.3.1 Valid Search Term
    test('T.3.1 Valid Search Term', async () => {
      const response = await request(app)
        .get('/proposals/search')
        .query({ term: 'Artificial Intelligence' });

      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe('OK');
      expect(response.body.data).toHaveLength(1); 
    });

    // T.3.2 Empty Search Term
    test('T.3.2 Empty Search Term', async () => {
      const response = await request(app)
        .get('/proposals/search')
        .query({ term: '' });

      expect(response.statusCode).toBe(404); 
    });

  });

  describe('Proposal API', () => {
    describe('T.5 Get Proposals', () => {
      // Assuming there are existing proposals in the database
      test('T.5.1 Get Proposals Successfully', async () => {
        const response = await request(app)
          .get('/proposals');
  
        expect(response.statusCode).toBe(200);
        expect(response.body.msg).toBe('OK');
        expect(response.body.data).toHaveLength(/* Number of proposals in the database */);
      });
    });

    describe('T.5 Get Proposal by ID', () => {
      // Assuming there is an existing proposal with a known ID
      const existingProposalId = 'knownProposalId';
  
      test('T.5.2 Get Proposal by ID Successfully', async () => {
        const response = await request(app)
          .get(`/proposals/${existingProposalId}`);
  
        expect(response.statusCode).toBe(200);
        expect(response.body.msg).toBe('OK');
        expect(response.body.data).toHaveLength(1); // Assuming it returns an array with one proposal
        expect(response.body.data[0].id).toBe(existingProposalId);
      });
    });
  });
});

