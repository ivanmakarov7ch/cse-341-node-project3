const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await User.deleteMany({ username: 'testuser' });
  await mongoose.connection.close();
});

describe('User Routes', () => {
  let userId;

  it('GET /api/users - get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/users - create user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ username: 'testuser', email: 'test@example.com' });
    userId = res.body._id;
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe('testuser');
  });

  it('GET /api/users/:id - get single user', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('testuser');
  });
});
