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
        <span>Create eps (level 3) from svg</span>
        <span class="subheader">for LaTeX chemnum package</span>
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
        <ul>
          <li><a href="#terminal-with-inkscape">EPS Level 3</a></li>
          <li><a href="#automation-with-python">Automation with python</a></li>
        </ul>
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