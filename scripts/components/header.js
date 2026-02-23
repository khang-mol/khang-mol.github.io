export function renderHeader() {
  const headerTemplate = document.createElement("template");
  headerTemplate.setAttribute("id", "header-template");
  const basePath = window.location.origin;
  
  headerTemplate.innerHTML = `
      <link rel="stylesheet" href="${basePath}/styles/reset.css">
      <style>
        h1 {
          display: flex;
          flex-direction: column;
          /* justify-content: center; */
          text-align: center;
        }
      
        .subheader {
          font-weight: normal;
          font-size: 1.25rem;
        }
      </style>
  
      <header id="top">
        <h1>
          <span>
            <slot name="h1-heading">Main title</slot>
          </span>
          <span class="subheader">
            <slot name="subheading">subheading</slot>
          </span>
        </h1>
        <div class="categorization">
          <dl style="display: flex; column-gap: 0.25rem;">
            <dt>Published under</dt>
            <dd>
              <slot name="category-slot">General</slot>
            </dd>
            <dt>on</dt>
            <dd><time>
              <slot name="publication-date">2026</slot>
            </time></dd>
          </dl>
          <dl style="display: flex; column-gap: 0.25rem;">
            <dt>Last updated</dt>
            <dt>on</dt>
            <dd><time>
              <slot name="updated-date">2026</slot>
            </time></dd>
          </dl>
        </div>
  
        <nav aria-label="table-of-contents">
          <p>Table of Contents</p>
          <ul class="table-of-contents"></ul>
        </nav>
      </header>
    `;
  
  class Header extends HTMLElement {
    constructor() {
      super();
    };
  
    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(headerTemplate.content);
    };
  };
  
  customElements.define("header-component", Header);
  
  
  const headerComponent = document.querySelector("header-component");
  const shadowRoot = headerComponent.shadowRoot;
  
  
  function renderTableOfContents() {
    const tableOfContents = shadowRoot.querySelector(".table-of-contents");
    const h2Headings = document.querySelectorAll("h2");
    h2Headings.forEach(heading => {
      const listItem = document.createElement("li");
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", `#${heading.id}`);
      linkElement.textContent = heading.textContent;
      listItem.appendChild(linkElement);
      tableOfContents.appendChild(listItem);
    });
  };
  
  renderTableOfContents();
};