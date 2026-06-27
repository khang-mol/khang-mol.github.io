//@ts-check
import { addGlobalEventListener } from "../../../scripts/components/allComponents.js";

import { createMolecule } from "./model/molecule.js";

import { CanvasRenderer } from "./render/CanvasRenderer.js";
import { atomTool } from "./tools/atom-tool.js";



function createAtomIndex(molecule) {
  const map = new Map();

  for (const atom of molecule.atoms) {
    map.set(atom.id, atom);
  };

  return map;
};



/**
 * Clicked button will be the active button.
 * @param {object} currentButton - clicked button
 */
function setAction(currentButton) {
  drawerActiveButton.classList.remove("active");
  currentButton.classList.add("active");
  drawerActiveButton = currentButton;
};


/** @type {object} */
let drawerActiveButton = document.querySelector("#button--draw-atom");

/** @type {object} */
const drawerButtons = document.querySelectorAll("[data-tool]");

drawerButtons.forEach(button => {
  button.addEventListener("click", () => {
    setAction(button);
  });
});


// addGlobalEventListener("click", "#button--draw-atom", e => {
//   // const button = docu
//   console.log(e);
// });
// addGlobalEventListener("click", "#button--draw-bond", e => {
//   // const button = docu
//   console.log(e);
// });


// const canvas = document.getElementById("canvas");
// if (!(canvas instanceof HTMLCanvasElement)) {
//   throw new Error("Canvas not found");
// };

/** @type {HTMLCanvasElement} */
const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("canvas")
);

function resizeCanvas() {
  const rectangle = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rectangle.width * dpr;
  canvas.height = rectangle.height * dpr;

  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

  return rectangle;
};
let rectangle = resizeCanvas();

const molecule = createMolecule();

const renderer = new CanvasRenderer(canvas);
renderer.render(molecule);

window.addEventListener("resize", () => {
  rectangle = resizeCanvas();
  renderer.render(molecule);
})



canvas.onclick = e => {
  rectangle = resizeCanvas();
  const x = e.clientX - rectangle.left;
  const y = e.clientY - rectangle.top;

  // const atom = findAtomAt(molecule, x, y);

  let tool = drawerActiveButton.dataset.tool;
  
  switch (tool) {
    case "atom":
      atomTool(molecule, x, y);
      break;
  
    default:
      console.log("No active button")
      break;
  }

  renderer.render(molecule);
  console.log(molecule);
};