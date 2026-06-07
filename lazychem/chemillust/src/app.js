//@ts-check
import { addGlobalEventListener } from "../../../scripts/components/allComponents.js";

import { createMolecule } from "./model/molecule.js";

import { CanvasRenderer } from "./render/CanvasRenderer.js";



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
  drawerActiveButton?.classList.remove("active");
  currentButton.classList.add("active");
  drawerActiveButton = currentButton;
};


/**
 * @type {object}
 */
let drawerActiveButton = document.querySelector("#button--draw-atom");

/**
 * @type {object}
*/
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


const canvas = document.getElementById("canvas");

const molecule = createMolecule();

const renderer = new CanvasRenderer(canvas);