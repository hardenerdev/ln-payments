import request from 'supertest';
import app from '../../src/app';

describe('GET /health', () => {
  test('returns status code 200 when app is running', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
  });
});

describe('GET non existing path', () => {
  test('returns status code 404 when route does not exists', async () => {
    const response = await request(app)
      .get('/mock')
      .expect(404);
  });
});
