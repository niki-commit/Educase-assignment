import { Cube } from "./cube.js";

/*
 * solveCube
 * cube - A Cube instance already scrambled.
 * scramble - The string of moves(seperated by " ") used to scramble it.
 * returns {{move: string, state: string}[]}
 */
export function solveCube(cube, scramble) {
  const steps = [];

  // Compute the inverse of a single move.
  const inverseMove = (m) => {
    if (m.endsWith("2'") || m.endsWith("2")) return m; // doubles are self-inverse
    if (m.endsWith("'")) return m[0]; // R' -> R
    return m + "'"; // R  -> R'
  };

  // Build the reversed, inverted move list.
  const inverseSequence = scramble
    .slice()
    .reverse() // undo last move first
    .map(inverseMove);

  // Apply each inverse move to the cube, recording the state.
  inverseSequence.forEach((move) => {
    const face = move[0];
    let dir = 1,
      times = 1;

    if (move.endsWith("2'")) {
      dir = -1;
      times = 2;
    } else if (move.endsWith("2")) {
      dir = 1;
      times = 2;
    } else if (move.endsWith("'")) {
      dir = -1;
      times = 1;
    }

    for (let i = 0; i < times; i++) {
      cube.rotateFace(face, dir);
    }

    steps.push({
      move,
      state: cube.toColorString(),
    });
  });

  return steps;
}
