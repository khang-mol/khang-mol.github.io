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

  const iodineMoles = Math.round(iodineMass / (126.904 * 2) * 10000) / 10000;
  const concentrationZincate = (Math.round(iodineMoles / (iodineEquivalents * usedZincate) * 10000) / 10000).toPrecision(3);

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
      = <strong>${concentrationZincate} M</strong>.
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
      <button type="button" class="copy" data-copy=".js-solution__iodometry-summary"
        onmouseout="const tooltip = document.querySelector('.js-tooltiptext');
                    tooltip.textContent = 'Copy to clipboard';">
        <span class="tooltiptext js-tooltiptext">Copy to clipboard</span>
        <!-- <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg> -->
        <span>Copy</span>
      </button>
    </div>
    <div id="test"></div>
  `;

  // // tutorial: https://www.youtube.com/watch?v=N1vNNT_0N0Y
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
    I₂ (${iodineMass}&nbsp;mg, ${iodineMoles}&nbsp;mmol, ${iodineEquivalents}&nbsp;eq.), zincate (${zincateHTML})
  `.trim();

  document.querySelectorAll(".copy").forEach(copyButton => {
    copyButton.addEventListener("click", () => {
      // console.log(typeof(copyButton.onclick));
      const targetElement = document.querySelector(copyButton.dataset.copy);
      targetElement.select(); // not really necessary
      targetElement.setSelectionRange(0, 99999); // for mobile
      navigator.clipboard.writeText(targetElement.textContent);
      const tooltip = document.querySelector(".js-tooltiptext");
      tooltip.textContent = "Copied!";
    });
  });
});

