const blogData = [{ 
  title: "How to set up Paths in MacOS",
  content: "Learn how to shorten terminal commands and paths. Useful for automation.",
  href: "./blogs/set_up_paths.html"
}, { 
  title: "Create .eps (level 3) files from .svg", 
  content: "Specifically useful, when an application only saves as .eps (level 2) like ChemDraw. Useful for IDEs (e.g. VSCode) without implicit conversion (e.g. Overleaf). Used for LaTeX chemnum package.",
  href: "./blogs/eps3_from_svg.html"
}
];

const blogContainer = document.querySelector(".blog-container");
const blogTemplate = document.querySelector(".blog-template");

blogData.forEach(news => {
  const clone = blogTemplate.content.cloneNode(true);
  const blogTitle = clone.querySelector(".blog-title");
  blogTitle.textContent = news.title;
  clone.querySelector(".blog-link").href = news.href;

  clone.querySelector(".blog-content").textContent = news.content;
  blogContainer.appendChild(clone);
});