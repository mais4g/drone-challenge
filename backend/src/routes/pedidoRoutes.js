const pedidoController = require('../controllers/pedidoController');

const schema = {
  body: {
    type: 'object',
    required: ['pesoKg', 'localizacao', 'prioridade'],
    properties: {
      pesoKg: { type: 'number', minimum: 0.1 },
      localizacao: { 
        type: 'object',
        properties: { 
          linha: { type: 'integer', minimum: 0 },
          coluna: { type: 'integer', minimum: 0 }
        },
        required: ['linha', 'coluna']
      },
      prioridade: { type: 'string', enum: ['BAIXA', 'MEDIA', 'ALTA'] }
    }
  }
};

async function routes(fastify, options) {
  fastify.post('/pedidos', { schema }, pedidoController.criarPedido);
  fastify.get('/pedidos', pedidoController.listarPedidos);
  fastify.get('/pedidos/:id', pedidoController.buscarPedidoPorId);

  fastify.patch('/pedidos/:id/status', {
    schema: {
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['AGUARDANDO_ALOCACAO', 'EM_VOO', 'ENTREGUE', 'CANCELADO'] }
        }
      }
    }
  }, pedidoController.atualizarStatusPedido);
}

module.exports = routes;