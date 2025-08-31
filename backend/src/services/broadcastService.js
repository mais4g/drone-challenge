let clients = [];

function addClient(client) {
  clients.push(client);
}

function removeClient(client) {
  clients = clients.filter(c => c !== client);
}

function broadcast(data) {
  const message = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === 1) { 
      client.send(message);
    }
  }
}

module.exports = {
  addClient,
  removeClient,
  broadcast,
};