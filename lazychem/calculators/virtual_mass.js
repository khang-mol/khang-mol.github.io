import { addGlobalEventListener } from "../../scripts/components/allComponents.js";


const impurityList = JSON.parse(localStorage.getItem("impurityList")) || [{
  integral: "",
  protons: "1",
  molecularWeight: "",
}];

function saveImpurityList() {
  localStorage.setItem("impurityList", JSON.stringify(impurityList));
};


renderImpurityList();

function renderImpurityList() {
  let impurityListHTML = '';

  impurityList.forEach((impurityObject, i) => {
    const impurityWrapper = document.createElement("div");
    // impurityWrapper.className = "impurity";

    const number = i+1;

    const html = `
      <p>Impurity ${number}:</p>
      <div>
        <label for="impurity-integral-${number}">Integral:</label>
        <input type="number" name="impurity-integral-${number}" id="impurity-integral-${number}" min="0" value="${impurityObject.integral}" required>
      </div>
      <div>
        <label for="impurity-H-${number}">Number of protons (H):</label>
        <input type="number" name="impurity-H-${number}" id="impurity-H-${number}" value="${impurityObject.protons}" min="1" required>
      </div>
      <div>
        <label for="impurity-MW-${number}">Molecular weight:</label>
        <input type="number" name="impurity-MW-${number}" id="impurity-MW-${number}" min="0" style="width: 8rem;" value="${impurityObject.molecularWeight}" required> g/mol
      </div>

      <button class="delete-button" data-delete-button="${i}">Delete</button>
    `;
    impurityWrapper.innerHTML = html;
    
    impurityListHTML += html;

    addGlobalEventListener("input", `#impurity-integral-${number}`, e => {
      impurityList[i].integral = e.target.value;
      saveImpurityList();
    });
    addGlobalEventListener("input", `#impurity-H-${number}`, e => {
      impurityList[i].protons = e.target.value;
      saveImpurityList();
    });
    addGlobalEventListener("input", `#impurity-MW-${number}`, e => {
      impurityList[i].molecularWeight = e.target.value;
      saveImpurityList();
    });
  });
  
  document.querySelector("#impurities-display").innerHTML = impurityListHTML;

  deleteImpurity();
};

function deleteImpurity() {
  const deleteButtons = document.querySelectorAll(".delete-button");
  // console.log(deleteButtons);
  deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
      const index = button.dataset.deleteButton;
      impurityList.splice(index, 1);
      saveImpurityList();
      renderImpurityList();
    });
  });
};

function addImpurity() {
  impurityList.push({
    integral: "",
    protons: "1",
    molecularWeight: "",
  });

  saveImpurityList();
  renderImpurityList();
};

addGlobalEventListener("click", "#add-impurity-button", () => {
  addImpurity();
});




function calculateVirtualMass() {
  let totalMass = Number(document.getElementById("total-mass").value);
  const productIntegral = Number(document.getElementById("product-integral").value);
  const productH = Number(document.getElementById("product-H").value);
  const productMW = Number(document.getElementById("product-MW").value);

  if (!(totalMass && productIntegral && productH && productMW)) {
    alert("Invalid numbers");
    return;
  };
  const productFraction = productIntegral/productH;

  const unit = document.getElementById("total-mass-select").value;
  if (unit === "g") {
    totalMass *= 1000;
  };


  let purityAcc = 0;
  let impurityAcc = 0;
  let ratio = productIntegral;
  
  impurityList.forEach((impurityObject, i) => {
    const impurityIntegral = Number(impurityObject.integral);
    const impurityH = Number(impurityObject.protons);
    const impurityMW = Number(impurityObject.molecularWeight);

    if (!(impurityIntegral && impurityH && impurityMW)) {
      alert("Invalid numbers");
      return;
    };

    const impurityFraction = impurityIntegral / impurityH;
    
    purityAcc += impurityFraction;
    impurityAcc += impurityFraction * impurityMW;
    ratio += `:${impurityIntegral}`;
  });

  
  const purity = Math.round(productFraction / (productFraction + purityAcc) * 100);


  const productMass = (totalMass * productFraction * productMW 
    / (productFraction * productMW 
    + impurityAcc));
  
  const productMoles = (productMass / productMW).toPrecision(3);

  let massFactor = 1;
  if (unit === "g") {
    massFactor *= 1000;
  };
  const printedMass = (productMass / massFactor).toFixed(1);
  let virtualMassResultHTML = `${printedMass} ${unit}, ${productMoles} mmol`;

  const expectedMoles = Number(document.getElementById("expected-moles").value);
  let productYield;
  if (expectedMoles) {
    productYield = Math.round((productMoles / expectedMoles) * 100);
    virtualMassResultHTML += `, ${productYield}%`;
  };

  let virtualMassHTML = `
    <div>
      <p><label for="virtual-mass__copy">Copy the short version:</label></p>
      <textarea name="virtual-mass__copy" id="virtual-mass__copy" class="js-virtual-mass__summary" cols="40" rows="2">
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

          +

          ...
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
          
          ...
        </span>
      </span>
    </p>

    <p>= <strong>${virtualMassResultHTML}</strong></p>
  `;

  document.querySelector(".js-extra-field__virtual-mass").innerHTML = virtualMassHTML;

  document.getElementById("virtual-mass__copy").textContent = `
    product (${virtualMassResultHTML}), ${purity}% purity (integrals: ${ratio}).
  `.trim();

  const copyButton = document.querySelector(".virtual-mass__copy-text");
  copyButton.addEventListener("click", () => {
    const targetElement = document.querySelector(copyButton.dataset.copy);
    targetElement.select(); // not really necessary
    targetElement.setSelectionRange(0, 9999); // for mobile
    navigator.clipboard.writeText(targetElement.textContent);
    const tooltip = document.querySelector(".js-tooltiptext-virtual-mass");
    tooltip.textContent = "Copied!";
  });
};

addGlobalEventListener("click", ".js-calculate-virtual-mass", () => {
  calculateVirtualMass();
});
addGlobalEventListener("keydown", "#virtual-mass input", e => {
  if (e.key === "Enter") {
    calculateVirtualMass();
  };
});
// addGlobalEventListener("change", "#total-mass-select", () => {
//   calculateVirtualMass();
// });

