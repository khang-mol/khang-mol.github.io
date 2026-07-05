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

export function resizeWidth(input, measure) {
  const style = getComputedStyle(input);
  measure.style.font = style.font;
  measure.textContent = input.value || input.placeholder || " ";
  
  input.style.width = (measure.offsetWidth + 20) + "px";
};