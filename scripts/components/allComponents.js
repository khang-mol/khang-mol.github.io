import { renderHeader } from "./header.js";
import { styleCodeblock } from "./styling.js";

renderHeader();
styleCodeblock();

/**
 * Wrapper function for simpler eventListeners.
 * @param {string} type click, keydown...
 * @param {string} selector classname, idname,...
 * @param {arrayCallback} callback Callback function.
 * @param {Document} parent Object from class Document, default: 'document'.
 */
export function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, e => {
    if (e.target.matches(selector)) {
      callback(e);
    };
  });
};

export function resizeWidth(input, measure, maxWidth) {
  const style = getComputedStyle(input);
  measure.style.font = style.font;
  measure.textContent = input.value || input.placeholder || " ";
  
  input.style.width = Math.min((measure.offsetWidth + 20), maxWidth) + "px";
};

export function switchIndeces(array, i, j) {
  [array[i], array[j]] = [array[j], array[i]];
};


/**
 * Takes array entry at index "oldIndex" and moves it to "newIndex"
 * @param {object} array - The array.
 * @param {number} oldIndex - Old index.
 * @param {number} newIndex - New index.
 */
export function moveIndex(array, oldIndex, newIndex) {
  const [item] = array.splice(oldIndex, 1);
  array.splice(newIndex, 0, item);
};