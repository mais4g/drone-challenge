const fastify = require('fastify');
const pedidoRoutes = require('../src/routes/pedidoRoutes');

let app;

beforeAll(async () => {
  app = fastify();
  app.register(pedidoRoutes, { prefix: '/api' });
  await app.ready();
});

afterAll(() => app.close());

test('Deve criar um pedido válido', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/pedidos',
    payload: {
      pesoKg: 5,
      localizacao: { linha: 2, coluna: 3 },
      prioridade: 'ALTA'
    }
  });

  expect(response.statusCode).toBe(201);
  const body = JSON.parse(response.body);
  expect(body).toHaveProperty('id');
  expect(body.pesoKg).toBe(5);
});

test('Não deve criar pedido com peso inválido', async () => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/pedidos',
    payload: {
      pesoKg: -1,
      localizacao: { linha: 2, coluna: 3 },
      prioridade: 'ALTA'
    }
  });

  expect(response.statusCode).toBe(400);
});