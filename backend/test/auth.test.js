import request from 'supertest';
import { app } from '../app'; // assuming we have app.js

describe('Authentication API', () => {
  describe('User Registration', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.message).toBe('User added successfully');
    });

    it('should return an error for empty parameters', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: '',
          email: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('At least one of the parameters in the request body is an empty string');
    });

    it('should return an error for an invalid email format', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'newuser',
          email: 'invalidemail',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('The email in the request body is not in a valid email format');
    });

    it('should return an error for an existing username', async () => {
      // Assuming 'existinguser' already exists in the database
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'existinguser',
          email: 'newuser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('The user in the request body identifies an already existing user');
    });

    it('should return an error for an existing email', async () => {
      // Assuming 'existinguser@example.com' already exists in the database
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'newuser',
          email: 'existinguser@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('The email in the request body identifies an already existing user');
    });
  });

 
});


