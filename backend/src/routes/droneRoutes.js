const droneController = require('../controllers/droneController');

async function routes(fastify, options) {
  fastify.post('/drones', droneController.criarDrone);
  fastify.get('/drones', droneController.listarDrones);
  fastify.get('/drones/:id', droneController.buscarDronePorId);
  fastify.patch('/drones/:id', droneController.atualizarDrone);
  fastify.delete('/drones/:id', droneController.removerDrone);
  fastify.get('/drones/status', droneController.statusFrota);
}

module.exports = routes;