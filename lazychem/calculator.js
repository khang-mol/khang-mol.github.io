export function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, e => {
    if (e.target.matches(selector)) {
      callback(e);
    };
  });
};

function titrationZincSolution() {
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
      <textarea name="solution__copy" id="solution__copy" class="js-solution__iodometry-summary" cols="45" rows="2">
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
};

addGlobalEventListener("click", ".js-solution__iodometry-calculate", () => {
  titrationZincSolution();
});
addGlobalEventListener("keydown", "#titration-zinc-solution input", e => {
  if (e.key === "Enter") {
    titrationZincSolution();
  };
});



function titrationGrignard() {
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
      <textarea name="grignard__copy" id="grignard__copy" class="js-grignard__titration-summary" cols="45" rows="2">
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
};

addGlobalEventListener("click", ".js-grignard__grignard-calculate", () => {
  titrationGrignard();
});
addGlobalEventListener("keydown", "#titration-grignard input", e => {
  if (e.key === "Enter") {
    titrationGrignard();
  };
});



function titrationLithium() {

  const suffertMass = document.getElementById("lithium__suffert-mass").value;
  const suffertReagent = document.getElementById("suffert-select").value;
  let suffertMolarMass;
  if (suffertReagent === "toluidine") {
    suffertMolarMass = 191.27;
  } else if (suffertReagent === "benzylaniline") {
    suffertMolarMass = 267.3720;
  }
  const usedLithium = document.getElementById("lithium__lithium-volume").value;

  if (!(Number(suffertMass) && Number(usedLithium))) {
    alert("Invalid numbers");
    return;
  };

  const suffertMoles = Math.round(suffertMass / suffertMolarMass * 1000) / 1000;
  const concentrationLithium = (Math.round(suffertMoles / (usedLithium) * 1000) / 1000).toPrecision(3);

  let lithiumTitrationHTML = `
    <p>For the titration of Suffert's reagent 
    (${suffertMass}&nbsp;mg,
    ${suffertMoles}&nbsp;mmol,
    <strong>${usedLithium}&nbsp;mL</strong> of organolithium solution was needed.
    </p>

    <p>
      The concentration of the organolithium solution is
      <span class="frac">
        <span>${suffertMoles}&nbsp;mmol</span>
        <span class="symbol">/</span>
        <span class="bottom">${usedLithium}&nbsp;mL</span>
      </span>
      = <strong>${concentrationLithium}&nbsp;M</strong>
    </p>
  `;

  const totalLithium = document.getElementById("lithium__lithium-volume-total").value;
  let totalLithiumMoles;
  if (Number(totalLithium)) {
    totalLithiumMoles = (concentrationLithium * totalLithium).toPrecision(3);
    lithiumTitrationHTML += `
      <p>Total moles of organolithium solution: ${concentrationLithium}&nbsp;M &middot; ${totalLithium}&nbsp;mL = <strong>${totalLithiumMoles}&nbsp;mmol</strong></p>
    `;
  }

  lithiumTitrationHTML += `
    <div>
      <p><label for="lithium__copy">Copy the short version:</label></p>
      <textarea name="lithium__copy" id="lithium__copy" class="js-lithium__titration-summary" cols="45" rows="2">
      </textarea>
    </div>
    <div class="tooltip">
      <button type="button" class="lithium__copy-text" data-copy=".js-lithium__titration-summary"
        onmouseout="const tooltip = document.querySelector('.js-tooltiptext-lithium__titration');
                    tooltip.textContent = 'Copy to clipboard';">
        <span class="tooltiptext js-tooltiptext-lithium__titration">Copy to clipboard</span>
        <span>Copy</span>
      </button>
    </div>
  `;

  document.querySelector(".js-lithium__extra-field").innerHTML = lithiumTitrationHTML;

  let lithiumHTML;
  if (Number(totalLithium)) {
    lithiumHTML = `${totalLithium}&nbsp;mL, ${concentrationLithium}&nbsp;M, ${totalLithiumMoles}&nbsp;mmol`;
  } else {
    lithiumHTML = `${concentrationLithium}&nbsp;M`;
  };
  document.getElementById("lithium__copy").innerHTML = `
    Suffert's reagent (${suffertMass}&nbsp;mg, ${suffertMoles}&nbsp;mmol) against ${usedLithium}&nbsp;mL, Lithium (${lithiumHTML})
  `.trim();

  document.querySelectorAll(".lithium__copy-text").forEach(copyButton => {
    copyButton.addEventListener("click", () => {
      const targetElementLithium = document.querySelector(copyButton.dataset.copy);
      targetElementLithium.select(); // not really necessary
      targetElementLithium.setSelectionRange(0, 99999); // for mobile
      navigator.clipboard.writeText(targetElementLithium.textContent);
      const tooltip = document.querySelector(".js-tooltiptext-lithium__titration");
      tooltip.textContent = "Copied!";
    });
  });
};

addGlobalEventListener("click", ".js-lithium__lithium-calculate", () => {
  titrationLithium();
});
addGlobalEventListener("keydown", "#titration-lithium input", e => {
  if (e.key === "Enter") {
    titrationLithium();
  };
});




addGlobalEventListener("click", ".js-calculate-virtual-mass", () => {
  const totalMass = document.getElementById("total-mass").value;
  const productIntegral = document.getElementById("product-integral").value;
  const productH = document.getElementById("product-H").value;
  const productMW = document.getElementById("product-MW").value;

  if (!(Number(totalMass) && Number(productIntegral) && Number(productH) && Number(productMW))) {
    alert("Invalid numbers");
    return;
  };
  
  const impurityIntegral1 = document.getElementById("impurity-integral-1").value;
  const impurityH1 = document.getElementById("impurity-H-1").value;
  const impurityMW1 = document.getElementById("impurity-MW-1").value;
  
  if (!(Number(impurityIntegral1) && Number(impurityH1) && Number(impurityMW1))) {
    alert("Invalid numbers");
    return;
  };
  
  const productFraction = productIntegral/productH;
  const impurity1Fraction = impurityIntegral1/impurityH1;
  const purity = (productFraction / (productFraction + impurity1Fraction) * 100).toFixed(0);


  const productMass = (totalMass * productFraction * productMW 
    / (productFraction * productMW 
    + (impurity1Fraction) * impurityMW1)).toFixed(1);
  
  const productMoles = (productMass / productMW).toPrecision(3);

  let virtualMassResultHTML = `${productMass} mg, ${productMoles} mmol`;

  const expectedMoles = document.getElementById("expected-moles").value;
  let productYield;
  if (Number(expectedMoles)) {
    productYield = (productMoles / expectedMoles).toFixed(2) * 100;
    virtualMassResultHTML += `, ${productYield}%`;
  };

  let virtualMassHTML = `
    <div>
      <p><label for="virtual-mass__copy">Copy the short version:</label></p>
      <textarea name="virtual-mass__copy" id="virtual-mass__copy" class="js-virtual-mass__summary" cols="40" rows="1">
      </textarea>
    </div>
    <div class="tooltip">
      <button type="button" class="virtual-mass__copy-text" data-copy=".js-virtual-mass__summary"
        onmouseout="const tooltip = document.querySelector('.js-tooltiptext-virtual-mass');
                    tooltip.textContent = 'Copy to clipboard';">
        <span class="tooltiptext js-tooltiptext-virtual-mass">Copy to clipboard</span>
        <span>Copy</span>
      </button>
    </div>

    <p>The actual mass of the product can be calculated according to the following formula:</p>
    <p>
      m<sub>P</sub> =
    
      m<sub>ges</sub> &middot;
      <span class="frac">
        <span>
          <span class="frac">
            <span>I<sub>P</sub></span>
            <span class="symbol">/</span>
            <span class="bottom">H<sub>P</sub></span>
          </span>
          <span>&middot; M<sub>P</sub></span>
        </span>

        <span class="symbol">/</span>
        
        <span class="bottom">
          <span class="frac">
            <span>I<sub>P</sub></span>
            <span class="symbol">/</span>
            <span class="bottom">H<sub>P</sub></span>
          </span>
          <span>&middot; M<sub>P</sub></span>

          +

          <span class="frac">
            <span>I<sub>I1</sub></span>
            <span class="symbol">/</span>
            <span class="bottom">H<sub>I1</sub></span>
          </span>
          <span>&middot; M<sub>I1</sub></span>
        </span>
      </span>
      
      =
      
      ${totalMass}&nbsp;mg &middot;
      <span class="frac">
        <span>
          <span class="frac">
            <span>${productIntegral}</span>
            <span class="symbol">/</span>
            <span class="bottom">${productH}</sub></span>
          </span>
          <span>&middot; ${productMW}&nbsp;g/mol</span>
          </span>
          
          <span class="symbol">/</span>
          
        <span class="bottom">
          <span class="frac">
            <span>${productIntegral}</span>
            <span class="symbol">/</span>
            <span class="bottom">${productH}</sub></span>
          </span>
          <span>&middot; ${productMW}&nbsp;g/mol</span>
          
          +
          
          <span class="frac">
            <span>${impurityIntegral1}</span>
            <span class="symbol">/</span>
            <span class="bottom">${impurityH1}</span>
          </span>
          <span>&middot; ${impurityMW1}&nbsp;g/mol</span>
        </span>
      </span>
    </p>

    <p>= <strong>${virtualMassResultHTML}</strong></p>
  `;

  document.querySelector(".js-extra-field__virtual-mass").innerHTML = virtualMassHTML;

  document.getElementById("virtual-mass__copy").textContent = `
    product (${virtualMassResultHTML}), ${purity}% purity.
  `.trim();

  document.querySelectorAll(".virtual-mass__copy-text").forEach(copyButton => {
    copyButton.addEventListener("click", () => {
      const targetElementGrignard = document.querySelector(copyButton.dataset.copy);
      targetElementGrignard.select(); // not really necessary
      targetElementGrignard.setSelectionRange(0, 99999); // for mobile
      navigator.clipboard.writeText(targetElementGrignard.textContent);
      const tooltip = document.querySelector(".js-tooltiptext-virtual-mass");
      tooltip.textContent = "Copied!";
    });
  });
});