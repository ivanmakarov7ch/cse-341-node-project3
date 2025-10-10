const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Order = require('../models/order');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await Order.deleteMany({ item: 'Test Item' });
  await mongoose.connection.close();
});

describe('Order Routes', () => {
  let orderId;

  it('GET /api/orders - get all orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/orders - create order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ item: 'Test Item', quantity: 2, price: 20 });
    orderId = res.body._id;
    expect(res.statusCode).toBe(201);
    expect(res.body.item).toBe('Test Item');
  });

  it('GET /api/orders/:id - get single order', async () => {
    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.item).toBe('Test Item');
  });
});
