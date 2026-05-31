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
        <input type="number" name="impurity-MW-${number}" id="impurity-MW-${number}" min="0" value="${impurityObject.molecularWeight}" required> g/mol
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
  const totalMass = document.getElementById("total-mass").value;
  const productIntegral = document.getElementById("product-integral").value;
  const productH = document.getElementById("product-H").value;
  const productMW = document.getElementById("product-MW").value;

  if (!(Number(totalMass) && Number(productIntegral) && Number(productH) && Number(productMW))) {
    alert("Invalid numbers");
    return;
  };
  const productFraction = productIntegral/productH;


  let purityAcc = 0;
  let impurityAcc = 0;
  let ratio = productIntegral;
  
  impurityList.forEach((impurityObject, i) => {
    const number = i + 1;
    const impurityIntegral = impurityObject.integral;
    const impurityH = impurityObject.protons;
    const impurityMW = impurityObject.molecularWeight;

    if (!(Number(impurityIntegral) && Number(impurityH) && Number(impurityMW))) {
      alert("Invalid numbers");
      return;
    };

    const impurityFraction = impurityIntegral / impurityH;
    
    purityAcc += impurityFraction;
    impurityAcc += impurityFraction * impurityMW;
    ratio += `:${impurityIntegral}`;
  });

  
  // const impurityIntegral1 = document.getElementById("impurity-integral-1").value;
  // const impurityH1 = document.getElementById("impurity-H-1").value;
  // const impurityMW1 = document.getElementById("impurity-MW-1").value;
  
  // if (!(Number(impurityIntegral1) && Number(impurityH1) && Number(impurityMW1))) {
  //   alert("Invalid numbers");
  //   return;
  // };
  
  // const impurity1Fraction = impurityIntegral1/impurityH1;
  const purity = (productFraction / (productFraction + purityAcc) * 100).toFixed(0);


  const productMass = (totalMass * productFraction * productMW 
    / (productFraction * productMW 
    + impurityAcc)).toFixed(1);
  
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


