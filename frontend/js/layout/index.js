/* =========================================================
   CONFIG
========================================================= */
const NAVBAR_DATA_URL = "/partials/data/navbar.json";
let navCache = null;

async function loadNavData() {
  if (navCache) return navCache;
  const res = await fetch(NAVBAR_DATA_URL);
  if (!res.ok) throw new Error("Erro ao carregar navbar.json");
  navCache = await res.json();
  return navCache;
}

/* =========================================================
   ICONES
========================================================= */
const Icons = {
  logo: `<svg viewBox="0 0 32 32"><path d="M18.774,19.7a3.727,3.727,0,0,0,3.376,2.078c1.418,0,2.324-.709,2.324-1.688c0-1.173-.931-1.589-2.491-2.272l-.856-.367c-2.469-1.052-4.11-2.37-4.11-5.156c0-2.567,1.956-4.52,5.012-4.52A5.058,5.058,0,0,1,26.9,10.52l-2.665,1.711a2.327,2.327,0,0,0-2.2-1.467a1.489,1.489,0,0,0-1.638,1.467c0,1.027.636,1.442,2.1,2.078l.856.366c2.908,1.247,4.549,2.518,4.549,5.376c0,3.081-2.42,4.769-5.671,4.769a6.575,6.575,0,0,1-6.236-3.5ZM6.686,20c.538.954,1.027,1.76,2.2,1.76c1.124,0,1.834-.44,1.834-2.15V7.975h3.422V19.658c0,3.543-2.078,5.156-5.11,5.156A5.312,5.312,0,0,1,3.9,21.688Z"/></svg>`,
  hamburger: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
  close: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
  sun: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/></svg>`,
  moon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>`
};

/* =========================================================
   HELPERS
========================================================= */
function createLogo() {
  return `
  <li class="nav__item--logo">
    <a href="/" aria-label="Home">${Icons.logo}</a>
  </li>`;
}
function createToggleMenu() {
  return `
    <li>
      <button id="js-menu-toggle" class="nav__btn-toggle" aria-controls="js-nav-aside" aria-expanded="false" aria-label="Abrir menu">
        <span class="nav__icon--open">${Icons.hamburger}</span>
        <span class="nav__icon--close hidden">${Icons.close}</span>
      </button>
    </li>`;
}



function createThemeToggle() {
  return `
  <li>
  <button class="theme-toggle" aria-label="Alternar tema claro/escuro">
        <span class="nav__icon--light">${Icons.sun}</span>
        <span class="nav__icon--dark hidden">${Icons.moon}</span>
      </button>
  </li>`;
}

function createNavItem(item, index) {

  const full = item.title;
  const short = item.shortTitle || item.title;

  const submenuId = `submenu-${index}`;

  const links = item.pages.map(page => {
    const rota = page.href
      .replace("/partials/pages/", "")
      .replace("/index.html", "");

    return `<li><a href="?pagina=${rota}">${page.text}</a></li>`;
  }).join("");

  return `
  <li class="nav__dropdown">
    <button class="nav__dropdown-title"
      aria-expanded="false"
      aria-controls="${submenuId}">
      
      <span class="nav__full">${full}</span>
      <span class="nav__abbr">${short}</span>

    </button>

    <ul id="${submenuId}" class="nav__submenu" hidden>
      ${links}
    </ul>
  </li>`;
}

/* =========================================================
   NAVBAR COMPONENT
========================================================= */
class NavBar extends HTMLElement {

  async connectedCallback() {

    const data = await loadNavData();

    const items = data.map((item, i) =>
      createNavItem(item, i)
    ).join("");

    this.innerHTML = `
      <nav class="nav-bar container">

        <ul>${createLogo()}</ul>
         <ul class="nav__menu-toggle">
          ${createToggleMenu()}
        </ul>

        <div class="nav__menu-wrapper">
          <ul class="nav__menu--desktop">
            ${items}
          </ul>
        </div>

        <ul class="nav__menu--theme--desktop">
          ${createThemeToggle()}
        </ul>


        <aside id="js-nav-aside" class="nav__aside">
      <div class="nav__aside-content">    <ul class="nav__menu--mobile">
            ${items}
          </ul>
          <ul>${createThemeToggle()}</ul></div>
        </aside>

      </nav>
    `;

    this.setupDropdowns();
  
  }

  setupDropdowns() {
    const dropdowns = this.querySelectorAll(".nav__dropdown");

    dropdowns.forEach(drop => {
      const button = drop.querySelector("button");
      const submenu = drop.querySelector(".nav__submenu");

      button.addEventListener("click", e => {
        e.stopPropagation();

        const isOpen = button.getAttribute("aria-expanded") === "true";

        this.closeAllDropdowns();

        button.setAttribute("aria-expanded", !isOpen);
        submenu.hidden = isOpen;
      });
    });

    document.addEventListener("click", () => {
      this.closeAllDropdowns();
    });
  }

  closeAllDropdowns() {
    this.querySelectorAll(".nav__dropdown button")
      .forEach(btn => btn.setAttribute("aria-expanded", "false"));

    this.querySelectorAll(".nav__submenu")
      .forEach(menu => menu.hidden = true);
  }}



customElements.define("nav-bar", NavBar);








/* =========================================================
   FOOTER COMPONENT
========================================================= */
function createFooterItem(item) {
  const links = item.pages.map(page => {
    const rota = page.href
      .replace("/partials/pages/", "")
      .replace("/index.html", "");

    return `<li><a href="?pagina=${rota}">${page.text}</a></li>`;
  }).join("");

  return `
    <div class="footer__column">
      <h4 class="footer__title">${item.title}</h4>
      <ul class="footer__sublist">
        ${links}
      </ul>
    </div>`;
}

class FooterBar extends HTMLElement {
  async connectedCallback() {
    const data = await loadNavData();
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

customElements.define("footer-bar", FooterBar);