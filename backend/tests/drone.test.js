const fastify = require('fastify');
const droneRoutes = require('../src/routes/droneRoutes');

let app;

beforeAll(async () => {
  app = fastify();
  app.register(droneRoutes, { prefix: '/api' });
  await app.ready();
});

afterAll(() => app.close());

test('Deve criar um drone válido', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/drones',
    payload: {
      modelo: 'DJI Matrice 300',
      capacidadeKg: 12,
      autonomiaKm: 50
    }
  });

  expect(response.statusCode).toBe(201);
  const body = JSON.parse(response.body);
  expect(body).toHaveProperty('id');
  expect(body.modelo).toBe('DJI Matrice 300');
});