const entregaController = require('../controllers/entregaController');

async function routes(fastify, options) {
  fastify.get('/entregas/rota/:id', entregaController.obterRotaPorPedido);
}

module.exports = routes;