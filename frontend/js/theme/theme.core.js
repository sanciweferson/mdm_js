export const htmlElement = document.documentElement
export let userPrefersDark = null

export const setUserPrefersDark = (value) => {
  userPrefersDark = value
  localStorage.setItem("darkMode", value.toString())
}

export const getStoredUserPrefersDark = () => {
  const stored = localStorage.getItem("darkMode")
  if (stored === "true") return true
  if (stored === "false") return false
  return null
}

export const getSystemPrefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches

export const updateTheme = (isDark) => {
  htmlElement.setAttribute("data-theme", isDark ? "dark" : "light")

  document
    .querySelectorAll(".nav__icon--dark")
    .forEach((el) => el.classList.toggle("hidden", isDark))

  document
    .querySelectorAll(".nav__icon--light")
    .forEach((el) => el.classList.toggle("hidden", !isDark))
}

export const applyEffectiveTheme = () => {
  const stored = getStoredUserPrefersDark()
  userPrefersDark = stored
  const isDark = stored !== null ? stored : getSystemPrefersDark()
  updateTheme(isDark)
}

export const toggleTheme = () => {
  const currentTheme = htmlElement.getAttribute("data-theme")
  const newIsDark = currentTheme !== "dark"
  setUserPrefersDark(newIsDark)
  updateTheme(newIsDark)
}

export const setupSystemThemeObserver = () => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

  const onSystemThemeChange = (e) => {
    if (userPrefersDark === null) {
      updateTheme(e.matches)
    }
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", onSystemThemeChange)
  } else {
    mediaQuery.addListener(onSystemThemeChange)
  }
}