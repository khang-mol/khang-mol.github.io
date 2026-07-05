import { addGlobalEventListener } from "../../scripts/components/allComponents.js";

const impurityListDefault = {
  integral: "",
  protons: "1",
  molecularWeight: "",
  check: true,
};

const impurityList = JSON.parse(
    localStorage.getItem("impurityList")
  ) || [impurityListDefault];

function saveImpurityList() {
  localStorage.setItem("impurityList", JSON.stringify(impurityList));
};


renderImpurityList();

function renderImpurityList() {
  let impurityListHTML = '';

  impurityList.forEach((impurityObject, index) => {
    const check = impurityObject.check ? "checked" : "";

    const number = index+1;

    const html = `
      <div class="${index % 2 === 0 ? "container-highlight-light" : "container-highlight"}
                  js-draggable-impurities
                  draggable" 
            style="padding: 8px;"
            draggable="true">
        <div>
          <input type="checkbox" name="impurity-${number}" id="impurity-${number}" class="impurity-checkbox" data-impurity-checkbox="${index}" ${check}>
          <label for="impurity-${number}">Impurity ${number}:</label>
        </div>
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
        <button class="delete-button" data-delete-button="${index}">Delete</button>
      </div>
    `;
    // impurityWrapper.innerHTML = html;
    
    impurityListHTML += html;

    addGlobalEventListener("input", `#impurity-integral-${number}`, e => {
      impurityObject.integral = e.target.value;
      saveImpurityList();
    });
    addGlobalEventListener("input", `#impurity-H-${number}`, e => {
      impurityObject.protons = e.target.value;
      saveImpurityList();
    });
    addGlobalEventListener("input", `#impurity-MW-${number}`, e => {
      impurityObject.molecularWeight = e.target.value;
      saveImpurityList();
    });
  });

  document.querySelector("#impurities-container").innerHTML = impurityListHTML;
  

  document.querySelectorAll(".impurity-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const id = Number(checkbox.dataset.impurityCheckbox);
      impurityList[id].check = checkbox.checked;
      saveImpurityList();
    });
  });
  

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
  impurityList.push(structuredClone(impurityListDefault));

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
    if (!impurityObject.check) return;

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
  const printedMass = (productMass / massFactor).toPrecision(3);
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
  // saveImpurityList();
  calculateVirtualMass();
});
addGlobalEventListener("keydown", "#virtual-mass input", e => {
  if (e.key === "Enter") {
    // saveImpurityList();
    calculateVirtualMass();
  };
});
// addGlobalEventListener("change", "#total-mass-select", () => {
//   calculateVirtualMass();
// });


// function draggable() {};

const draggableImpurities = document.querySelectorAll(".js-draggable-impurities");
const impuritiesContainer = document.querySelector("#impurities-container");

draggableImpurities.forEach(draggable => {
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});


impuritiesContainer.addEventListener("dragover", e => {
  // e.preventDefault(); // prevents cursor as "do not allow" or similar
  const afterElement = getDragAfterElement(impuritiesContainer, e.clientY);
  // console.log(afterElement);

  const draggable = impuritiesContainer.querySelector(".dragging");
  
  if (afterElement == null) {
    impuritiesContainer.appendChild(draggable);
  } else {
    impuritiesContainer.insertBefore(draggable, afterElement);
  };
});


function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
  const afterElement = draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - (box.height / 2);
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child};
    };

    return closest;
    
  }, { offset: Number.NEGATIVE_INFINITY }).element;

  return afterElement;
};