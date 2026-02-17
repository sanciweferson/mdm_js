
function configurarScroll() {
  const nav = document.querySelector(".header");
  const app = document.getElementById("app");

  if (!nav) return;

  function atualizarEstadoScroll() {
    // Tenta pegar o scroll do app, se for 0, tenta o da janela (window)
    const y = app ? app.scrollTop : 0;
    const windowY = window.scrollY;

    // Usa o que for maior para garantir que detectou o movimento
    const scrollAtual = Math.max(y, windowY);

    console.log("Posição detectada:", scrollAtual);

    if (scrollAtual > 10) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  // Escuta scroll no app E na janela global por segurança
  if (app) app.addEventListener("scroll", atualizarEstadoScroll);
  window.addEventListener("scroll", atualizarEstadoScroll);

  atualizarEstadoScroll();
}

document.addEventListener("DOMContentLoaded", configurarScroll);