const fastify = require("fastify")({ logger: true });
//const cors = require("@fastify/cors");

/*
fastify.register(cors, {
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PATCH", "DELETE"], 
});
*/

const pedidoRoutes = require("./routes/pedidoRoutes");
const droneRoutes = require("./routes/droneRoutes");
const alocacaoRoutes = require("./routes/alocacaoRoutes");
const entregaRoutes = require('./routes/entregaRoutes');

fastify.register(pedidoRoutes, { prefix: "/api" });
fastify.register(droneRoutes, { prefix: "/api" });
fastify.register(alocacaoRoutes, { prefix: "/api" });
fastify.register(entregaRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info("🚀 Servidor rodando em http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();