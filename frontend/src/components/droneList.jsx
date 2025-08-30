import { useEffect, useState } from "react";
import api from "../api";

export default function DroneList() {
  const [drones, setDrones] = useState([]);
  const [status, setStatus] = useState({});

  useEffect(() => {
    async function fetchData() {
      const res = await api.get("/drones");
      setDrones(res.data);

      const resStatus = await api.get("/drones/status");
      setStatus(resStatus.data);
    }
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Drones</h2>
      <p>
        Total: {status.total} | Ociosos: {status.ociosos} | Em Voo: {status.emVoo} | Recarregando: {status.recarregando}
      </p>
      <ul>
        {drones.map((d) => (
          <li key={d.id}>
            {d.modelo} - {d.status} - Bateria: {d.bateria}%
          </li>
        ))}
      </ul>
    </div>
  );
}