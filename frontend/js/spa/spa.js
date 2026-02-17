let app;
let homeHTML;
let paginaAtual = null;

function capturarHome() {
  app = document.getElementById("app");
  if (app) homeHTML = app.innerHTML;
}

// Intercepta Cliques
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("http")) return;

  // Gerenciamento de Hash (#secao)
  if (href.includes("#") && !href.includes("?pagina=")) {
    e.preventDefault();
    const id = href.split("#")[1];
    history.pushState(null, "", "/index.html#" + id);
    app.innerHTML = homeHTML;
    paginaAtual = null;

    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return;
  }

  // Gerenciamento de Rotas SPA (?pagina=)
  if (href.includes("?pagina=")) {
    e.preventDefault();
    const urlParams = new URL(href, location.origin).searchParams;
    const pagina = urlParams.get("pagina");

    if (!pagina || pagina === paginaAtual) return;

    paginaAtual = pagina;
    history.pushState(null, "", "/index.html?pagina=" + pagina);
    carregarPagina(pagina);
  }
});

function carregarPagina(pagina) {
  const url = `/partials/pages/${pagina}/index.html`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Página não encontrada");
      return res.text();
    })
    .then(html => {
      app.innerHTML = html;
      window.scrollTo(0, 0);
      document.title = "Docs — " + pagina.split('/').pop(); // Título amigável

      carregarScriptDaPagina(pagina);
      carregarCSSDaPagina(pagina);
    })
    .catch(err => {
      console.error(err);
      app.innerHTML = "<h2>404 - Página não encontrada</h2>";
    });
}

function carregarEstado() {
  if (!app) capturarHome();

  const urlParams = new URLSearchParams(location.search);
  const pagina = urlParams.get("pagina");

  if (pagina) {
    paginaAtual = pagina;
    carregarPagina(pagina);
  } else if (location.hash) {
    // Trata recarregamento com #
    app.innerHTML = homeHTML;
    const id = location.hash.slice(1);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
    }, 100);
  } else {
    app.innerHTML = homeHTML;
    paginaAtual = null;
  }
}

// Funções de injeção de recursos (CSS/JS)
function carregarScriptDaPagina(pagina) {
  const antigo = document.getElementById("script-pagina");
  if (antigo) antigo.remove();
  const script = document.createElement("script");
  script.src = `/partials/pages/${pagina}/index.js`;
  script.id = "script-pagina";
  script.onerror = () => script.remove();
  document.body.appendChild(script);
}

function carregarCSSDaPagina(pagina) {
  const antigo = document.getElementById("css-pagina");
  if (antigo) antigo.remove();
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `/partials/pages/${pagina}/index.css`;
  link.id = "css-pagina";
  document.head.appendChild(link);
}

window.addEventListener("popstate", carregarEstado);
window.addEventListener("DOMContentLoaded", carregarEstado);