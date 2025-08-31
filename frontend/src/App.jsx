import React, { useState, useEffect, useMemo } from "react";
import api from "./api";
import FormPedido from "./components/formPedido";
import DroneList from "./components/droneList";
import PedidoList from "./components/pedidoList";
import GridSimulacao from "./components/gridSimulacao";
import "./App.css";

function App() {
  const [drones, setDrones] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [rotas, setRotas] = useState({});
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [filtroPedidos, setFiltroPedidos] = useState("TODOS");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [dronesRes, pedidosRes] = await Promise.all([
          api.get("/drones"),
          api.get("/pedidos"),
        ]);
        setDrones(dronesRes.data);
        setPedidos(pedidosRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:3000/api/updates");

    ws.onopen = () => console.log("✅ Conectado ao servidor WebSocket!");
    ws.onclose = () => console.log("🔌 Desconectado do servidor WebSocket.");
    ws.onerror = (error) => console.error("Erro no WebSocket:", error);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "DRONE_UPDATE":
          setDrones((prev) =>
            prev.map((d) =>
              d.id === message.payload.id ? { ...d, ...message.payload } : d
            )
          );
          break;
        case "PEDIDO_UPDATE":
          setPedidos((prev) =>
            prev.map((p) =>
              p.id === message.payload.id ? message.payload : p
            )
          );
          break;
        case "NOVO_PEDIDO":
          setPedidos((prev) => [...prev, message.payload]);
          break;
        case "ROTA_UPDATE":
          setRotas((prev) => ({
            ...prev,
            [message.payload.pedidoId]: [
              ...(prev[message.payload.pedidoId] || []),
              { linha: message.payload.posX, coluna: message.payload.posY },
            ],
          }));
          break;
        default:
          break;
      }
    };

    return () => ws.close();
  }, []);

  const buscarRotaHistorica = async (pedidoId) => {
    try {
      const response = await api.get(`/entregas/rota/${pedidoId}`);
      const rotaHistorica = response.data.map((ponto) => ({
        linha: ponto.posX,
        coluna: ponto.posY,
      }));
      setRotas((prev) => ({
        ...prev,
        [pedidoId]: rotaHistorica,
      }));
    } catch (error) {
      console.error("Erro ao buscar rota histórica:", error);
      setRotas((prev) => ({
        ...prev,
        [pedidoId]: [],
      }));
    }
  };

  const handleSelectPedido = async (pedidoId) => {
    setPedidoSelecionado(pedidoId);
    
    const pedido = pedidos.find((p) => p.id === pedidoId);
    
    if (pedido && pedido.status === "ENTREGUE" && !rotas[pedidoId]) {
      await buscarRotaHistorica(pedidoId);
    }
  };

  const pedidosFiltrados = useMemo(() => {
    if (filtroPedidos === "TODOS") {
      return pedidos;
    }
    return pedidos.filter((pedido) => pedido.status === filtroPedidos);
  }, [pedidos, filtroPedidos]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🚁 Simulador de Entrega com Drones</h1>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Modo claro" : "Modo escuro"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      <main className="main-3col">
        <aside className="col col-control">
          <FormPedido />
          <DroneList drones={drones} />
        </aside>

        <section className="col col-pedidos">
          <PedidoList
            pedidos={pedidosFiltrados}
            onSelectPedido={handleSelectPedido}
            onFiltroChange={setFiltroPedidos}
            filtroAtual={filtroPedidos}
            pedidoSelecionado={pedidoSelecionado}
          />
        </section>

        <section className="col col-simulacao">
          {pedidoSelecionado ? (
            <GridSimulacao
              drones={drones}
              pedidoSelecionadoId={pedidoSelecionado}
              rotas={rotas}
              pedidos={pedidos}
            />
          ) : (
            <div className="card empty-simulation">
              <p>Selecione um pedido para visualizar a simulação 🚀</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;