function bfs(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [[start, [start]]]; // [posição, caminho]

  while (queue.length > 0) {
    const [pos, path] = queue.shift();
    const [x, y] = pos;

    if (x === end[0] && y === end[1]) {
      return path; // caminho encontrado
    }

    const moves = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ];

    for (const [nx, ny] of moves) {
      if (
        nx >= 0 && nx < rows &&
        ny >= 0 && ny < cols &&
        grid[nx][ny] === 0 &&
        !visited[nx][ny]
      ) {
        visited[nx][ny] = true;
        queue.push([[nx, ny], [...path, [nx, ny]]]);
      }
    }
  }

  return null; // sem caminho
}

module.exports = { bfs };