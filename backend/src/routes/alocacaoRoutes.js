const { alocarPedidos } = require('../services/alocacaoService');

async function routes(fastify, options) {
  // Rota manual para disparar alocação
  fastify.post('/alocar', async (request, reply) => {
    try {
      await alocarPedidos();
      return reply.send({ message: 'Processo de alocação executado com sucesso' });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  });
}

module.exports = routes;