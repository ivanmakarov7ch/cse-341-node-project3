const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Cake = require('../models/cake');

// Connect to DB
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

// Cleanup DB after tests
afterAll(async () => {
  await Cake.deleteMany({ name: 'Test Cake' });
  await mongoose.connection.close();
});

describe('Cake Routes', () => {
  let cakeId;

  it('GET /api/cakes - should return all cakes', async () => {
    const res = await request(app).get('/api/cakes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/cakes - create cake (mock auth bypass)', async () => {
    const res = await request(app)
      .post('/api/cakes')
      .send({ name: 'Test Cake', flavor: 'Chocolate', price: 10, available: true });
    cakeId = res.body._id;
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Cake');
  });

  it('GET /api/cakes/:id - get single cake', async () => {
    const res = await request(app).get(`/api/cakes/${cakeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Test Cake');
  });

  it('DELETE /api/cakes/:id - delete cake', async () => {
    const res = await request(app).delete(`/api/cakes/${cakeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Cake deleted');
  });
});
