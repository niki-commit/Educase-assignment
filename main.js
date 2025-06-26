import { Cube } from "./cube.js";
import { generateScramble, applyScramble } from "./scramble.js";
import { solveCube } from "./solver.js";

// getCubeSvg() Implementation
export function getCubeSvg(colorString) {
  const size = 20; // pixel per small square
  const faceSize = 3 * size;
  const width = 4 * faceSize;
  const height = 3 * faceSize;
  const colors = {
    r: "#c00", // red
    g: "#0a0", // green
    b: "#00a", // blue
    y: "#ee0", // yellow
    o: "#f60", // orange
    w: "#fff", // white
  };

  // Map face order indices
  const faces = {
    U: 0,
    R: 1,
    F: 2,
    D: 3,
    L: 4,
    B: 5,
  };
  // Layout offsets (in faces) [x,y] for each face
  // U is above F, L-F-R-B in the middle, D below F
  const offsets = {
    U: [1, 0],
    L: [0, 1],
    F: [1, 1],
    R: [2, 1],
    B: [3, 1],
    D: [1, 2],
  };

  // Parse the 54-char string into facelets
  const arr = colorString.split("");
  const facelets = {};
  Object.entries(faces).forEach(([face, idx]) => {
    const start = idx * 9;
    facelets[face] = arr.slice(start, start + 9);
  });

  // Building SVG
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  for (const [face, fl] of Object.entries(facelets)) {
    const [offX, offY] = offsets[face];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3),
        col = i % 3;
      const x = offX * faceSize + col * size;
      const y = offY * faceSize + row * size;
      const c = colors[fl[i]] || "#000";
      svg += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${c}" stroke="#000"/>`;
    }
  }

  svg += `</svg>`;
  return svg;
}

// UI Logic
const btnScramble = document.getElementById("btn-scramble");
const btnSolve = document.getElementById("btn-solve");
const scrambleNotes = document.getElementById("scramble-notes");
const problemCube = document.getElementById("problem-cube");
const stepsContainer = document.getElementById("solution-steps");
const inputLen = document.getElementById("scramble-length");

let currentCube = null;
let currentScramble = [];

btnScramble.addEventListener("click", () => {
  const len = parseInt(inputLen.value, 10) || 20;
  const seq = generateScramble(len);
  const { cube, scramble } = applyScramble(seq);

  currentCube = cube;
  currentScramble = seq;
  scrambleNotes.textContent = scramble;
  problemCube.innerHTML = getCubeSvg(cube.toColorString());
  stepsContainer.innerHTML = "";
  btnSolve.disabled = false;
});

btnSolve.addEventListener("click", () => {
  if (!currentCube) return;

  // const cubeCopy = currentCube.clone();
  const solution = solveCube(currentCube, currentScramble);

  stepsContainer.innerHTML = "";
  solution.forEach(({ move, state }, idx) => {
    const stepEl = document.createElement("div");
    stepEl.className = "step";

    const mv = document.createElement("div");
    mv.className = "move";
    mv.textContent = `${idx + 1}. ${move}`;
    stepEl.appendChild(mv);

    const svgWrap = document.createElement("div");
    svgWrap.className = "cube-svg";
    svgWrap.innerHTML = getCubeSvg(state);
    stepEl.appendChild(svgWrap);

    stepsContainer.appendChild(stepEl);
  });

  btnSolve.disabled = true;
});
