

// Solving a cube using layer by layer method
import { Cube } from "./cube.js";

export function solveCube(cube) {
  let steps = [];

  // Helper function to apply moves and record steps
  function applyMoves(moves) {
    moves.forEach((m) => {
      const face = m[0];
      let dir = 1,
        times = 1;
      if (m.endsWith("2'")) {
        dir = -1;
        times = 2;
      } else if (m.endsWith("2")) {
        dir = 1;
        times = 2;
      } else if (m.endsWith("'")) {
        dir = -1;
        times = 1;
      }
      for (let i = 0; i < times; i++) cube.rotate(face, dir);
    });
    steps.push({ move: moves.join(" "), state: cube.toColorString() });
  }

  // 1) Solve first layer cross
}
