export function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, e => {
    if (e.target.matches(selector)) {
      callback(e);
    };
  });
};

addGlobalEventListener("click", ".js-solution__iodometry-calculate", e => {
  const iodineMass = document.getElementById("solution__iodine-mass").value;
  const iodineEquivalents = document.getElementById("solution__iodine-equivalents").value;
  const usedZincate = document.getElementById("solution__zincate-volume").value;

  if (!(Number(iodineMass) && Number(iodineEquivalents) && Number(usedZincate))) {
    alert("Invalid numbers");
    return;
  };

  const iodineMoles = Math.round(iodineMass / (126.904 * 2) * 1000) / 1000;
  const concentrationZincate = (Math.round(iodineMoles / (iodineEquivalents * usedZincate) * 1000) / 1000).toPrecision(3);

  let solutionIodometryHTML = `
    <p>For the titration of I<sub>2</sub> 
      (${iodineMass}&nbsp;mg, 
      ${iodineMoles}&nbsp;mmol, 
      ${iodineEquivalents}&nbsp;eq.), 
      <strong>${usedZincate}&nbsp;mL</strong> of zincate was needed.
    </p>
  
    <p>
      The concentration of zincate is
      <span class="frac">
        <span>${iodineMoles}&nbsp;mmol</span>
        <span class="symbol">/</span>
        <span class="bottom">${iodineEquivalents} &middot; ${usedZincate}&nbsp;mL</span>
      </span>
      = <strong>${concentrationZincate}&nbsp;M</strong>.
    </p>
    `;
    
  const totalZincate = document.getElementById("solution__zincate-volume-total").value;
  let totalZincateMoles;
  if (Number(totalZincate)) {
    totalZincateMoles = (concentrationZincate * totalZincate).toPrecision(3);
    solutionIodometryHTML += `
      <p>Total moles of zincate: ${concentrationZincate}&nbsp;M &middot; ${totalZincate}&nbsp;mL = <strong>${totalZincateMoles}&nbsp;mmol</strong>.</p>
    `;
  };

  solutionIodometryHTML += `
    <div>
      <p><label for="solution__copy">Copy the short version:</label></p>
      <textarea name="solution__copy" id="solution__copy" class="js-solution__iodometry-summary" cols="35" rows="2">
      </textarea>
      <!--
      <div contenteditable="true" id="solution__copy" name="solution__copy" class="js-solution__iodometry-summary">
      </div>
      -->
    </div>
    <div class="tooltip">
      <button type="button" class="solution__iodometry-copy" data-copy=".js-solution__iodometry-summary"
        onmouseout="const tooltip = document.querySelector('.js-tooltiptext-solution__iodometry');
                    tooltip.textContent = 'Copy to clipboard';">
        <span class="tooltiptext js-tooltiptext-solution__iodometry">Copy to clipboard</span>
        <!-- <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg> -->
        <span>Copy</span>
      </button>
    </div>
  `;

  // // tutorial&nbsp; https://www.youtube.com/watch?v=N1vNNT_0N0Y
  // let trustedTypes;
  // if (typeof(trustedTypes) === "undefined") {
  //   trustedTypes = { createPolicy: (n, rules) => rules };
  // }
  
  // const escapeHTMLPolicy = trustedTypes.createPolicy("myEscapePolicy", {
  //   createHTML: (string) => string.replace(/</g, "&lt;"),
  // });
  
  // document.querySelector(".js-extra-field").innerHTML = escapeHTMLPolicy.createHTML(solutionIodometryHTML);
  
  document.querySelector(".js-extra-field").innerHTML = solutionIodometryHTML;
  
  let zincateHTML;
  if (Number(totalZincate)) {
    zincateHTML = `${totalZincate}&nbsp;mL, ${concentrationZincate}&nbsp;M, ${totalZincateMoles}&nbsp;mmol`;
  } else {
    zincateHTML = `${concentrationZincate}&nbsp;M`;
  };
  document.getElementById("solution__copy").innerHTML = `
    I₂ (${iodineMass}&nbsp;mg, ${iodineMoles}&nbsp;mmol, ${iodineEquivalents}&nbsp;eq.) against ${usedZincate}&nbsp;mL, zincate (${zincateHTML})
  `.trim();

  document.querySelectorAll(".solution__iodometry-copy").forEach(copyButton => {
    copyButton.addEventListener("click", () => {
      // console.log(typeof(copyButton.onclick));
      const targetElement = document.querySelector(copyButton.dataset.copy);
      targetElement.select(); // not really necessary
      targetElement.setSelectionRange(0, 99999); // for mobile
      navigator.clipboard.writeText(targetElement.textContent);
      const tooltip = document.querySelector(".js-tooltiptext-solution__iodometry");
      tooltip.textContent = "Copied!";
    });
  });
});



addGlobalEventListener("click", ".js-grignard__grignard-calculate", () => {
  const loveMass = document.getElementById("grignard__love-mass").value;
  const loveEquivalents = document.getElementById("grignard__love-equivalents").value;
  const usedGrignard = document.getElementById("grignard__grignard-volume").value;

  if (!(Number(loveMass) && Number(loveEquivalents) && Number(usedGrignard))) {
    alert("Invalid numbers");
    return;
  };

  const loveMoles = Math.round(loveMass / 212.2520 * 1000) / 1000;
  const concentrationGrignard = (Math.round(loveMoles / (loveEquivalents * usedGrignard) * 1000) / 1000).toPrecision(3);

  let grignardTitrationHTML = `
    <p>For the titration of Love's reagent 
    (${loveMass}&nbsp;mg,
    ${loveMoles}&nbsp;mmol,
    ${loveEquivalents}&nbsp;eq.),
    <strong>${usedGrignard}&nbsp;mL</strong> of Grignard solution was needed.
    </p>

    <p>
      The concentration of the Grignard solution is
      <span class="frac">
        <span>${loveMoles}&nbsp;mmol</span>
        <span class="symbol">/</span>
        <span class="bottom">${loveEquivalents} &middot; ${usedGrignard}&nbsp;mL</span>
      </span>
      = <strong>${concentrationGrignard}&nbsp;M</strong>
    </p>
  `;

  const totalGrignard = document.getElementById("grignard__grignard-volume-total").value;
  let totalGrignardMoles;
  if (Number(totalGrignard)) {
    totalGrignardMoles = (concentrationGrignard * totalGrignard).toPrecision(3);
    grignardTitrationHTML += `
      <p>Total moles of Grignard solution: ${concentrationGrignard}&nbsp;M &middot; ${totalGrignard}&nbsp;mL = <strong>${totalGrignardMoles}&nbsp;mmol</strong></p>
    `;
  }

  grignardTitrationHTML += `
    <div>
      <p><label for="grignard__copy">Copy the short version:</label></p>
      <textarea name="grignard__copy" id="grignard__copy" class="js-grignard__titration-summary" cols="35" rows="2">
      </textarea>
    </div>
    <div class="tooltip">
      <button type="button" class="grignard__copy-text" data-copy=".js-grignard__titration-summary"
        onmouseout="const tooltip = document.querySelector('.js-tooltiptext-grignard__titration');
                    tooltip.textContent = 'Copy to clipboard';">
        <span class="tooltiptext js-tooltiptext-grignard__titration">Copy to clipboard</span>
        <span>Copy</span>
      </button>
    </div>
  `;

  document.querySelector(".js-grignard__extra-field").innerHTML = grignardTitrationHTML;

  let grignardHTML;
  if (Number(totalGrignard)) {
    grignardHTML = `${totalGrignard}&nbsp;mL, ${concentrationGrignard}&nbsp;M, ${totalGrignardMoles}&nbsp;mmol`;
  } else {
    grignardHTML = `${concentrationGrignard}&nbsp;M`;
  };
  document.getElementById("grignard__copy").innerHTML = `
    Love's reagent (${loveMass}&nbsp;mg, ${loveMoles}&nbsp;mmol, ${loveEquivalents}&nbsp;eq.) against ${usedGrignard}&nbsp;mL, Grignard (${grignardHTML})
  `.trim();

  document.querySelectorAll(".grignard__copy-text").forEach(copyButton => {
    copyButton.addEventListener("click", () => {
      const targetElementGrignard = document.querySelector(copyButton.dataset.copy);
      targetElementGrignard.select(); // not really necessary
      targetElementGrignard.setSelectionRange(0, 99999); // for mobile
      navigator.clipboard.writeText(targetElementGrignard.textContent);
      const tooltip = document.querySelector(".js-tooltiptext-grignard__titration");
      tooltip.textContent = "Copied!";
    });
  });
});