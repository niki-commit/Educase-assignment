// Generating and applying a random scramble to a cube instance
import { Cube } from "./cube.js";

// Face moves and directions like single ("U"), inverse ("U'"), double ("U2"), and double-inverse ("U2'").
const MOVES = [
  'U', "U'", 'U2', "U2'",
  'R', "R'", 'R2', "R2'",
  'F', "F'", 'F2', "F2'",
  'D', "D'", 'D2', "D2'",
  'L', "L'", 'L2', "L2'",
  'B', "B'", 'B2', "B2'"
];

/*
 * Generating random scramble of given length.
 * Ensures no two consecutive moves are on the same face.
 */
export function generateScramble(length = 20) {
  const scramble = [];
  let lastFace = null;

  while (scramble.length < length) {
    const move = MOVES[Math.floor(Math.random() * MOVES.length)];
    const face = move[0]; // letter before any suffix
    if (face === lastFace) continue;
    scramble.push(move);
    lastFace = face;
  }

  return scramble;
}

/*
 * Apply a scramble (array of move strings) to a new Cube and return it.
 * It supports singles, inverses, doubles, and double-inverses rotations.
 */
export function applyScramble(scramble) {
  const cube = new Cube();

  scramble.forEach(move => {
    const face = move[0];
    // Determine number of 90 degree turns and direction(1 for clockwise, -1 for anti-clockwise)
    let turns = 1;
    let dir = 1;

    if (move.endsWith("2'")) {
      turns = 2;
      dir = -1;
    } else if (move.endsWith('2')) {
      turns = 2;
      dir = 1;
    } else if (move.endsWith("'")) {
      turns = 1;
      dir = -1;
    }

    for (let i = 0; i < turns; i++) {
      cube.rotateFace(face, dir);
    }
  });

  return {
    cube,
    scramble: scramble.join(' ')
  };
}