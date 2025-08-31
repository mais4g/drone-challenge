export default function DroneList({ drones }) {
  return (
    <div>
      <h2>Drones</h2>
      <ul>
        {drones.map((d) => (
          <li key={d.id}>
            {d.modelo} - <b>{d.status}</b> - Bateria: {d.bateria}% - Posição: (
            {d.posX}, {d.posY})
          </li>
        ))}
      </ul>
    </div>
  );
}