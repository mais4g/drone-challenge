const fastify = require('fastify')({ logger: true });
const pedidoRoutes = require('./routes/pedidoRoutes');
const droneRoutes = require('./routes/droneRoutes');
const alocacaoRoutes = require('./routes/alocacaoRoutes');

fastify.register(pedidoRoutes, { prefix: '/api' });
fastify.register(droneRoutes, { prefix: '/api' });
fastify.register(alocacaoRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();