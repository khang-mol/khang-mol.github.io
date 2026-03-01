const blogData = [
  { 
    title: "Create .eps (level 3) files from .svg", 
    content: "Specifically useful, when an application only saves as .eps (level 2) like ChemDraw. Useful for IDEs (e.g. VSCode) without implicit conversion (e.g. Overleaf). Used for LaTeX chemnum package.",
    href: "./blogs/eps3_from_svg.html"
  },
  {
    title: "Chemdraw: Lesser known tips",
    content: "Here I present lesser known tips inside and outside the actual application.",
    href: "./blogs/chemdraw_tips.html",
  },
  {
    title: "My VSCode configurations",
    content: "I will present my settings, keybindings, snippets and so on.",
    href: "./blogs/vscode_configurations.html",
  },
  {
    title: "Useful links for Chemistry",
    content: "A list of softwares and useful links I use for my chemistry related tasks.",
    href: "./blogs/chemistry_useful_links.html",
  },
  {
    title: "Links for accessible graphs",
    content: "Includes color use and general graphics design.",
    href: "./blogs/accessible_color_use.html",
  },
  {
    title: "Useful Japanese links and Add-ons",
    content: "Legal and legitimate links and Add-ons for learning Japanese.",
    href: "./blogs/japanese_links.html",
  },
  // {
  //   title: "How to set up Paths in MacOS",
  //   content: "Learn how to shorten terminal commands and paths. Useful for automation.",
  //   href: "./blogs/set_up_paths.html",
  // },
];

const blogContainer = document.querySelector(".js-blog-container");
const blogTemplate = document.querySelector(".js-blog-template");

blogData.forEach(news => {
  const clone = blogTemplate.content.cloneNode(true);
  const blogTitle = clone.querySelector(".js-blog-title");
  blogTitle.textContent = news.title;
  clone.querySelector(".js-blog-link").href = news.href;

  clone.querySelector(".js-blog-content").textContent = news.content;
  blogContainer.appendChild(clone);
});