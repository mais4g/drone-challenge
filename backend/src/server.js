const fastify = require("fastify")({ logger: true });
const websocket = require("@fastify/websocket");
const cors = require("@fastify/cors");

const broadcastService = require("./services/broadcastService.js");
const pedidoRoutes = require("./routes/pedidoRoutes.js");
const droneRoutes = require("./routes/droneRoutes.js");
const alocacaoRoutes = require("./routes/alocacaoRoutes.js");
const entregaRoutes = require('./routes/entregaRoutes.js');

async function build() {
  const app = fastify;

  await app.register(cors, {
    origin: "http://localhost:5173",
  });

  await app.register(websocket);

  app.register(async (instance) => {
    instance.register(pedidoRoutes, { prefix: "/api" });
    instance.register(droneRoutes, { prefix: "/api" });
    instance.register(alocacaoRoutes, { prefix: "/api" });
    instance.register(entregaRoutes, { prefix: '/api' });

    instance.get('/api/updates', { websocket: true }, (connection, req) => {
      try {
        instance.log.info('Cliente WebSocket conectado.');
        broadcastService.addClient(connection.socket);

        connection.socket.on('close', () => {
          instance.log.info('Cliente WebSocket desconectado.');
          broadcastService.removeClient(connection.socket);
        });

        connection.socket.on('error', (error) => {
          instance.log.error({ err: error }, 'Erro no WebSocket:');
        });

      } catch (error) {
        instance.log.error({ err: error }, 'Erro fatal no handler da conexão WebSocket');
        connection.socket.close();
      }
    });
  });

  return app;
}

const start = async () => {
  try {
    const app = await build();
    await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();