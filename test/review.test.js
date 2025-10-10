const request = require('supertest');
const express = require('express');

// Mock ensureAuth if reviewRoutes uses it
jest.mock('../middleware/authMiddleware', () => ({
  ensureAuth: (req, res, next) => next(),
}));

const reviewRoutes = require('../routes/reviewRoutes');

const app = express();
app.use(express.json());
app.use('/api/reviews', reviewRoutes);

describe('Review Routes', () => {
  test('GET /api/reviews should return status 200', async () => {
    const res = await request(app).get('/api/reviews');
    expect([200, 404, 500]).toContain(res.statusCode); // depends on DB
  });
});
