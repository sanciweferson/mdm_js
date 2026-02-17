// ================================
// CONFIG
// ================================

const NAVBAR_DATA_URL = "/partials/data/navbar.json";

// cache em memória
let navCache = null;


// ================================
// DATA LOADER (fonte única)
// ================================

async function loadNavData() {

  if (navCache) return navCache;

  const res = await fetch(NAVBAR_DATA_URL);

  if (!res.ok) {
    throw new Error("Falha ao carregar navbar.json");
  }

  navCache = await res.json();

  return navCache;
}


// ================================
// HELPERS
// ================================

// converte caminho em rota SPA
function normalizeRoute(href) {

  return href
    .replace("/partials/pages/", "")
    .replace("/index.html", "");

}
// ============================
// ICONS
// ============================
// Objeto que armazena os caminhos SVG para manter o HTML principal limpo.
const Icons = {
  logo: `<svg viewBox="0 0 32 32"><path d="M18.774,19.7a3.727,3.727,0,0,0,3.376,2.078c1.418,0,2.324-.709,2.324-1.688c0-1.173-.931-1.589-2.491-2.272l-.856-.367c-2.469-1.052-4.11-2.37-4.11-5.156c0-2.567,1.956-4.52,5.012-4.52A5.058,5.058,0,0,1,26.9,10.52l-2.665,1.711a2.327,2.327,0,0,0-2.2-1.467a1.489,1.489,0,0,0-1.638,1.467c0,1.027.636,1.442,2.1,2.078l.856.366c2.908,1.247,4.549,2.518,4.549,5.376c0,3.081-2.42,4.769-5.671,4.769a6.575,6.575,0,0,1-6.236-3.5ZM6.686,20c.538.954,1.027,1.76,2.2,1.76c1.124,0,1.834-.44,1.834-2.15V7.975h3.422V19.658c0,3.543-2.078,5.156-5.11,5.156A5.312,5.312,0,0,1,3.9,21.688Z" /></svg>`,
  hamburger: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  moon: ` <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`,
  sun: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
};

// ============================
// HELPERS (Geradores de Template)
// ============================

/**
 * Cria a estrutura da Logo. 
 * O aria-label ajuda tecnologias assistivas a entenderem o destino do link.
 */
function createLogo() {
  return `
    <li class="nav__item--logo">
      <a href="/" aria-label="Página inicial">
        ${Icons.logo}
      </a>
    </li>
  `;
}

/**
 * Cria o botão de alternância de tema. 
 * Usamos spans para alternar entre os ícones via CSS (ex: .hidden { display: none; }).
 */
function createThemeToggle() {
  return `
    <li>
      <button class="theme-toggle" aria-label="Alternar tema claro/escuro">
        <span class="nav__icon--light">${Icons.sun}</span>
        <span class="nav__icon--dark hidden">${Icons.moon}</span>
      </button>
    </li>
  `;
}

/**
 * Botão para o menu mobile.
 * aria-controls: Conecta o botão ao elemento que ele controla (o menu lateral).
 * aria-expanded: Indica se o menu está aberto ou fechado para leitores de tela.
 */
function createToggleMenu() {
  return `
    <li>
      <button
        id="js-menu-toggle"
        class="nav__btn-toggle"
        aria-controls="js-nav-aside"
        aria-expanded="false"
        aria-label="Abrir menu"
      >
        <span class="nav__icon--open">${Icons.hamburger}</span>
        <span class="nav__icon--close hidden">${Icons.close}</span>
      </button>
    </li>
  `;
}

/**
 * Gera um item de menu com dropdown.
 * Correção de acessibilidade: O botão recebe aria-haspopup="true" e o submenu recebe hidden por padrão.
 */
function createNavBar(item, index) {
  const submenuId = `submenu-${index}`;

  const links = item.pages.map(page => {
    // Limpeza da string para gerar a query param da URL
    const rota = page.href
      .replace("/partials/pages/", "")
      .replace("/index.html", "");

    return `
      <li>
        <a href="?pagina=${rota}">
          ${page.text}
        </a>
      </li>
    `;
  }).join("");

  return `
    <li class="nav__dropdown">
      <button
        class="nav__dropdown-title"
        aria-expanded="false"
        aria-controls="${submenuId}"
        aria-haspopup="true"
      >
        ${item.title}
      </button>

      <ul
        id="${submenuId}"
        class="nav__submenu"
        hidden
      >
        ${links}
      </ul>
    </li>
  `;
}

// ============================
// NAVBAR COMPONENT
// ============================

class NavBar extends HTMLElement {
  async connectedCallback() {
    // Busca os dados do arquivo JSON
    const res = await fetch("/partials/data/navbar.json");
    const data = await res.json();

    // Transforma os dados em HTML usando a função auxiliar
    const navItems = data.map(createNavBar).join("");

    // Renderiza a estrutura interna do Componente
    this.innerHTML = `
      <nav class="nav-bar container">
        <ul>
          ${createLogo()}
        </ul>

        <ul class="nav__menu-toggle">
          ${createToggleMenu()}
        </ul>
<div class="nav__menu-wrapper">
  <ul class="nav__menu--desktop">
    ${navItems}
  </ul>
</div>
        <ul class="nav__menu--theme--desktop">
          ${createThemeToggle()}
        </ul>

        <aside id="js-nav-aside" class="nav__aside">
          <ul>
            ${navItems}
          </ul>
          <ul>
            ${createThemeToggle()}
          </ul>
        </aside>
      </nav>
    `;

    // Chama a função para configurar a interatividade (Dropdowns)
    this.setupAccessibility();
  }

  /**
   * Configura a lógica de abertura/fechamento dos Dropdowns.
   */
  setupAccessibility() {
    const dropdowns = this.querySelectorAll(".nav__dropdown");

    dropdowns.forEach(drop => {
      const button = drop.querySelector("button");
      const submenu = drop.querySelector(".nav__submenu");

      // Evento de Clique para abrir/fechar dropdown
      button.addEventListener("click", (event) => {
        // Evita que o evento suba e feche o menu imediatamente
        event.stopPropagation();

        const isOpen = button.getAttribute("aria-expanded") === "true";

        // Alterna o estado de acessibilidade
        button.setAttribute("aria-expanded", !isOpen);

        // Alterna a visibilidade do submenu
        submenu.hidden = isOpen;
      });

      // Fechar com a tecla ESC para melhor acessibilidade
      button.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          button.setAttribute("aria-expanded", "false");
          submenu.hidden = true;
          button.focus(); // Retorna o foco ao botão
        }
      });
    });

    // Fecha qualquer dropdown se o usuário clicar fora do menu
    document.addEventListener("click", () => {
      dropdowns.forEach(drop => {
        drop.querySelector("button").setAttribute("aria-expanded", "false");
        drop.querySelector(".nav__submenu").hidden = true;
      });
    });
  }
}

// Define o elemento customizado <nav-bar></nav-bar>
customElements.define("nav-bar", NavBar);

// ============================
// FOOTER COMPONENT
// ============================

/**
 * Gera as colunas do rodapé.
 */
function createFooterItem(item) {
  const links = item.pages.map(page => {
    const rota = page.href
      .replace("/partials/pages/", "")
      .replace("/index.html", "");

    return `
      <li>
        <a href="?pagina=${rota}">
          ${page.text}
        </a>
      </li>
    `;
  }).join("");

  return `
    <div class="footer__column">
      <h4 class="footer__title">
        ${item.title}
      </h4>
      <ul class="footer__sublist">
        ${links}
      </ul>
    </div>
  `;
}

class FooterBar extends HTMLElement {
  async connectedCallback() {
    const res = await fetch("/partials/data/navbar.json");
    const data = await res.json();

    const content = data.map(createFooterItem).join("");

    this.innerHTML = `
      <footer class="footer">
        <div class="footer__container container">
          <div class="footer__grid">
            ${content}
          </div>
          <div class="footer__bottom">
            © 2026 JS Docs
          </div>
        </div>
      </footer>
    `;
  }
}

// Define o elemento customizado <footer-bar></footer-bar>
customElements.define("footer-bar", FooterBar);