// Apenas o essencial para o funcionamento estrutural
const Icons = {
  logo: ` <svg viewBox="0 0 32 32">
    <path d="M18.774,19.7a3.727,3.727,0,0,0,3.376,2.078c1.418,0,2.324-.709,2.324-1.688c0-1.173-.931-1.589-2.491-2.272l-.856-.367c-2.469-1.052-4.11-2.37-4.11-5.156c0-2.567,1.956-4.52,5.012-4.52A5.058,5.058,0,0,1,26.9,10.52l-2.665,1.711a2.327,2.327,0,0,0-2.2-1.467a1.489,1.489,0,0,0-1.638,1.467c0,1.027.636,1.442,2.1,2.078l.856.366c2.908,1.247,4.549,2.518,4.549,5.376c0,3.081-2.42,4.769-5.671,4.769a6.575,6.575,0,0,1-6.236-3.5ZM6.686,20c.538.954,1.027,1.76,2.2,1.76c1.124,0,1.834-.44,1.834-2.15V7.975h3.422V19.658c0,3.543-2.078,5.156-5.11,5.156A5.312,5.312,0,0,1,3.9,21.688Z" />
  </svg>`,
  hamburger: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  moon: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`,
  sun: `<svg " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`

};
function createLogo() {
  return `
    <li class="nav__item--logo">
      <a href="/" aria-label="Logo do site">
        ${Icons.logo}
      </a>
    </li>
  `;
}

function createThemeToggle() {
  return `
    <li>
      <button  type="button" class="theme-toggle" aria-label="Alternar tema" aria-expanded="false">
        <span class="nav__icon--light">${Icons.sun}</span>
        <span class="nav__icon--dark hidden">${Icons.moon}</span>
      </button>
    </li>
  `;
}

function createToggleMenu() {
  return `
    <li>
      <button id="js-menu-toggle" type="button" class="nav__btn-toggle" aria-label="Abrir menu" aria-expanded="false">
        <span class="nav__icon--open">${Icons.hamburger}</span>
        <span class="nav__icon--close hidden">${Icons.close}</span>
      </button>
    </li>
  `;
}


function createNavBar(item) {
  const subPages = item.pages.map(page => {
    // AJUSTE: Transformamos o caminho do JSON em uma rota de query string para a SPA
    // Ex: de "/partials/pages/fundamentos/introducao/index.html" 
    // Para: "fundamentos/introducao"
    const rotaSpa = page.href
      .replace('/partials/pages/', '')
      .replace('/index.html', '');

    return `<li><a href="?pagina=${rotaSpa}">${page.text}</a></li>`;
  });
  return `
  <li  class="nav__dropdown" >
  <div class="nav__dropdown-title">${item.title}</div>
<ul class="nav__submenu">
        ${subPages.join("")} 
      </ul>
  </li>
  `
}

class navBar extends HTMLElement {
  async connectedCallback() {
    try {
      const res = await fetch("/partials/data/navbar.json")
      const navData = await res.json()
      const navList = navData.map(createNavBar).join("")
      const menuToggleHTML = createToggleMenu();
      const logoHTML = createLogo();
      const themeToggleHTML = createThemeToggle();
      this.innerHTML = `
    <nav class="nav-bar container"> 
    <ul>${logoHTML}</ul>
     <ul class="nav__menu-toggle">${menuToggleHTML}</ul>
    <ul class="nav__menu--desktop">${navList}</ul>
    <ul class="nav__menu--theme--desktop">${themeToggleHTML}</ul>
    <aside id="js-nav-aside" class="nav__aside "> 
     <ul class="nav__menu--mobile">${navList}</ul>
    <ul class="nav__menu--theme--mobile">${themeToggleHTML}</ul>
    </aide>
    </nav>
    `
    } catch (err) {
      console.error("Erro ao carregar o menu de navegação:", err)
      this.innerHTML = "<p>Erro ao carregar o menu de navegação.</p>"
    }
  }
}
customElements.define("nav-bar", navBar)

// ===== Footer =====

function createFooterItem(item) {
  const subPages = item.pages.map(page => {
    const route = page.href
      .replace("/partials/pages/", "")
      .replace("/index.html", "");

    return `<li><a href="?pagina=${route}">${page.text}</a></li>`;
  }).join("");

  return `
    <div class="footer__column">
      <h4 class="footer__title">${item.title}</h4>
      <ul class="footer__sublist">${subPages}</ul>
    </div>
  `;
}






class FooterBar extends HTMLElement {
  async connectedCallback() {
    try {
      const res = await fetch("/partials/data/navbar.json")
      const navData = await res.json()
      const footerContent = navData.map(createFooterItem).join("");
      
      this.innerHTML = `
       <footer class="footer">
          <div class="footer__container container">
            <ul class="footer__grid">
              ${footerContent}
            </ul>
            <div class="footer__bottom">
              <p>© 2026 JS Docs - Documentação Progressiva</p>
            </div>
          </div>
        </footer>
    
    `
    } catch (err) {
      console.error("Erro ao carregar o menu de navegação:", err)
      this.innerHTML = "<p>Erro ao carregar o menu de navegação.</p>"
    }
  }
}
customElements.define("footer-bar", FooterBar)
