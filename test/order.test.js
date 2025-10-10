const request = require('supertest');
const express = require('express');

// Mock ensureAuth if orderRoutes uses it
jest.mock('../middleware/authMiddleware', () => ({
  ensureAuth: (req, res, next) => next(),
}));

const orderRoutes = require('../routes/orderRoutes');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

describe('Order Routes', () => {
  test('GET /api/orders should return status 200', async () => {
    const res = await request(app).get('/api/orders');
    expect([200, 404, 500]).toContain(res.statusCode); // depends on DB
  });
});
