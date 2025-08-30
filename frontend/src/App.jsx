import { useState } from "react";
import DroneList from "./components/droneList";
import PedidoList from "./components/pedidoList";
import FormPedido from "./components/formPedido";
import GridSimulacao from "./components/gridSimulacao";

function App() {
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      <div>
        <FormPedido />
        <PedidoList onSelectPedido={setPedidoSelecionado} />
      </div>
      <div>
        <DroneList />
        {pedidoSelecionado && (
          <GridSimulacao pedidoId={pedidoSelecionado} />
        )}
      </div>
    </div>
  );
}

export default App;