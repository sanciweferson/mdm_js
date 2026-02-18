import {
  applyEffectiveTheme,
  toggleTheme,
  setupSystemThemeObserver,
} from "./theme.core.js"

const setupThemeButtons = () => {
  const buttons = document.querySelectorAll(".nav__btn-theme ")
  if (!buttons.length) return

  const updateAriaLabels = () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark"

    buttons.forEach((button) => {
      button.setAttribute(
        "aria-label",
        isDark ? "Alternar para tema claro" : "Alternar para tema escuro"
      )
    })
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleTheme()
      updateAriaLabels()
    })
  })

  updateAriaLabels()
}

export const initTheme = () => {
  applyEffectiveTheme()

  setTimeout(() => {
    setupThemeButtons()
    setupSystemThemeObserver()
  }, 50)
}