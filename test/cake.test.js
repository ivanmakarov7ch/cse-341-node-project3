const request = require('supertest');
const express = require('express');

// Mock ensureAuth middleware
jest.mock('../middleware/authMiddleware', () => ({
  ensureAuth: (req, res, next) => next(),
}));

const cakeRoutes = require('../routes/cakeRoutes');

const app = express();
app.use(express.json());
app.use('/api/cakes', cakeRoutes);

describe('Cake Routes', () => {
  test('GET /api/cakes should return all cakes', async () => {
    const res = await request(app).get('/api/cakes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/cakes/:id with invalid ID should return 500 or 404', async () => {
    const res = await request(app).get('/api/cakes/invalidid');
    expect([404, 500]).toContain(res.statusCode);
  });
});
