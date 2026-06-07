//@ts-check
import { addGlobalEventListener } from "../../scripts/components/allComponents.js";

const molecule = {
  atoms: [],
  bonds: [],
};

let atomId = 0;
let bondId = 0;


/**
 * Clicked button will be the active button.
 * @param {object} currentButton - clicked button
 */
function setAction(currentButton) {
  drawerActiveButton?.classList.remove("active");
  currentButton.classList.add("active");
  drawerActiveButton = currentButton;
};


const canvas = document.getElementById("canvas");

/**
 * @type {object}
 */
let drawerActiveButton = document.querySelector("#button--draw-atom");

/**
 * @type {object}
*/
const drawerButtons = document.querySelectorAll(".toolbar--drawer-button");

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

