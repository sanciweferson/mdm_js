// top
// ===============================
// BOTÃO VOLTAR AO TOPO + PROGRESSO
// ===============================

const btnTop = document.getElementById("btn-top");

if (btnTop) {

  const progressCircle = btnTop.querySelector(".progress");

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  progressCircle.style.strokeDasharray = circumference;

  function atualizarProgresso() {
    const scrollTop = window.scrollY;
    const altura = document.documentElement.scrollHeight - window.innerHeight;

    const progresso = scrollTop / altura;
    const offset = circumference - progresso * circumference;

    progressCircle.style.strokeDashoffset = offset;

    if (scrollTop > 200) {
      btnTop.classList.add("show");
    } else {
      btnTop.classList.remove("show");
    }
  }

  btnTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", atualizarProgresso);
}


