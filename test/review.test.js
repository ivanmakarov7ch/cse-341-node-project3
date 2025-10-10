const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Review = require('../models/review');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await Review.deleteMany({ title: 'Test Review' });
  await mongoose.connection.close();
});

describe('Review Routes', () => {
  let reviewId;

  it('GET /api/reviews - get all reviews', async () => {
    const res = await request(app).get('/api/reviews');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/reviews - create review', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ title: 'Test Review', rating: 5, comment: 'Great!' });
    reviewId = res.body._id;
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Review');
  });

  it('GET /api/reviews/:id - get single review', async () => {
    const res = await request(app).get(`/api/reviews/${reviewId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Test Review');
  });
});
