/*
 *Cube class represents a 3×3 Rubik's Cube.
 * Faces: U (Up), R (Right), F (Front), D (Down), L (Left), B (Back).
 * Each face is a 2D array: 3 rows × 3 columns of color letters.
 */

export class Cube {
  constructor(colorString) {
    this.faces = { U: [], R: [], F: [], D: [], L: [], B: [] };

    //To create a cube from string or to give a initial solved cube
    if (colorString) {
      this._loadFromString(colorString);
    } else {
      this._initSolved();
    }
  }

  // Private method to load cube from given string
  _loadFromString(inputString) {
    // String should be 54 characters length to make valid cube
    // Order: U (0–8), R (9–17), F (18–26), D (27–35), L (36–44), B (45–53)
    if (inputString.length != 54) {
      throw new Error("Invalid cube length, must be 54 characters");
    }

    // If valid fill each face with string
    const facesOrder = ["U", "R", "F", "D", "L", "B"];
    facesOrder.forEach((face, index) => {
      const start = index * 9;
      const eachFaceString = inputString.slice(start, start + 9).split("");
      // Converting eachFaceString array to 3×3 array
      this.faces[face] = [
        eachFaceString.slice(0, 3),
        eachFaceString.slice(3, 6),
        eachFaceString.slice(6, 9),
      ];
    });
  }

  // Private method to fill each face with single color
  _initSolved() {
    // Took reference from internet and problem statement for color representation of faces
    const colors = { U: "w", R: "r", F: "g", D: "y", L: "o", B: "b" };
    for (const face in this.faces) {
      const color = colors[face];
      this.faces[face] = [
        [color, color, color],
        [color, color, color],
        [color, color, color],
      ];
    }
  }

  // Convert cube to string representation
  toColorString() {
    let colorString = "";
    for (const face in this.faces) {
      this.faces[face].forEach((row) => {
        row.forEach((color) => (colorString += color));
      });
    }
    return colorString;
  }

  // Creating a deep copy of cube for showing in steps
  // clone() {
  //   const copy = new Cube();
  //   for (const face in this.faces) {
  //     // Copy each 3×3 array
  //     copy.faces[face] = this.faces[face].map((row) => [...row]);
  //   }
  //   return copy;
  // }

  /*
   * Rotating face to 90 degrees simulating manual rotation.
   * params include face to rotate and direction (1 for clockwise, -1 for anti clockwise)
   */
  rotateFace(face, dir = 1) {
    this._rotateFaceMatrix(face, dir);
    this._rotateEdges(face, dir);
  }

  // Private method to rotate 3x3 face matrix in place
  _rotateFaceMatrix(face, dir) {
    const newMat = this.faces[face];
    const old = newMat.map((row) => [...row]); // copy

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (dir === 1) {
          // clockwise: new[r][c] = old[2-c][r]
          newMat[r][c] = old[2 - c][r];
        } else {
          // counter-clockwise: new[r][c] = old[c][2-r]
          newMat[r][c] = old[c][2 - r];
        }
      }
    }
  }

  // Private method to edge strips around the rotating face
  _rotateEdges(face, dir) {
    // 1) Defining neighbour edges for each face [[face, index of row|col to rotate, 'row'|'col' to rotate]]
    const neighbors = {
      U: [
        ["B", 0, "row"],
        ["R", 0, "row"],
        ["F", 0, "row"],
        ["L", 0, "row"],
      ],
      D: [
        ["F", 2, "row"],
        ["R", 2, "row"],
        ["B", 2, "row"],
        ["L", 2, "row"],
      ],
      F: [
        ["U", 2, "row"],
        ["R", 0, "col"],
        ["D", 0, "row"],
        ["L", 2, "col"],
      ],
      B: [
        ["U", 0, "row"],
        ["L", 0, "col"],
        ["D", 2, "row"],
        ["R", 2, "col"],
      ],
      L: [
        ["U", 0, "col"],
        ["F", 0, "col"],
        ["D", 0, "col"],
        ["B", 2, "col"],
      ],
      R: [
        ["U", 2, "col"],
        ["B", 0, "col"],
        ["D", 2, "col"],
        ["F", 2, "col"],
      ],
    };
    const nbr = neighbors[face]; // Selection of neighbour based on face

    // 2) Getting all the edge strips from cube using nbr
    const edgeStrips = nbr.map(([f, rowOrColIndx, type]) => {
      const arr = [];
      for (let i = 0; i < 3; i++) {
        arr.push(
          type === "row"
            ? this.faces[f][rowOrColIndx][i]
            : this.faces[f][i][rowOrColIndx]
        );
      }
      return arr;
    });

    // 3) Shifting edge strips based on direction
    const shifted = edgeStrips.map((_, i) => edgeStrips[(i - dir + 4) % 4]);

    // 4) Assigning shifted edges back to cube faces
    shifted.forEach((arr, i) => {
      const [f, rowOrCol, type] = nbr[i];
      for (let j = 0; j < 3; j++) {
        if (type === "row") this.faces[f][rowOrCol][j] = arr[j];
        else this.faces[f][j][rowOrCol] = arr[j];
      }
    });
  }
}
