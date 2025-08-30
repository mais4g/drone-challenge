const { alocarPedidos } = require('../src/services/alocacaoService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.drone.create({
    data: {
      modelo: 'Wingcopter 198',
      capacidadeKg: 6,
      autonomiaKm: 75,
      status: 'OCIOSO',
      bateria: 100,
      posX: 0,
      posY: 0
    }
  });

  await prisma.pedido.create({
    data: {
      pesoKg: 3,
      prioridade: 'ALTA',
      status: 'AGUARDANDO_ALOCACAO',
      localizacao: {
        create: { linha: 2, coluna: 2 }
      }
    }
  });
});

test('Deve alocar pedido em drone disponível', async () => {
  await alocarPedidos();

  const pedido = await prisma.pedido.findFirst();
  expect(pedido.status).not.toBe('AGUARDANDO_ALOCACAO');
});