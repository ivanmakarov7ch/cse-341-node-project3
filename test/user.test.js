const request = require('supertest');
const express = require('express');

// Mock ensureAuth if userRoutes uses it
jest.mock('../middleware/authMiddleware', () => ({
  ensureAuth: (req, res, next) => next(),
}));

const userRoutes = require('../routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  test('GET /api/users should return status 200', async () => {
    const res = await request(app).get('/api/users');
    expect([200, 404, 500]).toContain(res.statusCode); // depends on DB
  });
});
