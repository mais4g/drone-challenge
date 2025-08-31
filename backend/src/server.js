/**
const fastify = require("fastify")({ logger: true });
const websocket = require("@fastify/websocket");
const broadcastService = require("./services/broadcastService");

fastify.register(websocket);

fastify.get("/api/test-broadcast", async (req, reply) => {
  broadcastService.broadcast({ type: "TEST", payload: { msg: "Hello WebSocket!" } });
  return { ok: true };
});

// Rota WebSocket
fastify.get("/api/updates", { websocket: true }, (connection, req) => {
  const ws = connection.socket; // ✅ WebSocket real

  broadcastService.addClient(ws);

  ws.on("close", () => {
    broadcastService.removeClient(ws);
  });
});

// Rotas REST
const pedidoRoutes = require("./routes/pedidoRoutes");
const droneRoutes = require("./routes/droneRoutes");
const alocacaoRoutes = require("./routes/alocacaoRoutes");
const entregaRoutes = require("./routes/entregaRoutes");

fastify.register(pedidoRoutes, { prefix: "/api" });
fastify.register(droneRoutes, { prefix: "/api" });
fastify.register(alocacaoRoutes, { prefix: "/api" });
fastify.register(entregaRoutes, { prefix: "/api" });

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info("🚀 Servidor rodando em http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
**/

const fastify = require("fastify")({ logger: true });
const websocket = require("@fastify/websocket");

fastify.register(websocket);

fastify.get("/api/updates", { websocket: true }, (connection, req) => {
  const ws = connection.socket; // WebSocket real

  ws.send("Conexão estabelecida com sucesso!");

  ws.on("message", (msg) => {
    fastify.log.info(`📩 Mensagem recebida: ${msg}`);
    ws.send(`ECO: ${msg}`);
  });

  ws.on("close", () => {
    fastify.log.info("🔌 Cliente desconectado");
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info("🚀 Servidor rodando em http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();