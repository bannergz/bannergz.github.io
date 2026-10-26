export type Theme = "light" | "dark";

/** localStorage key for the visitor's explicit choice. No key: follow the system. */
export const THEME_KEY = "theme";

/**
 * Inlined in <head> so a stored choice lands on <html> before the first
 * paint; without it a dark-mode visitor sees a white flash on every load.
 * Storage can throw (private mode, blocked site data), hence the try.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

const DARK_QUERY = "(prefers-color-scheme: dark)";
const CHANGE_EVENT = "themechange";

/** The theme in effect: the stored choice, else the system's. */
export function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia?.(DARK_QUERY).matches ? "dark" : "light";
}

export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // The choice still applies for this page view.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeTheme(onChange: () => void): () => void {
  const mq = window.matchMedia?.(DARK_QUERY);
  mq?.addEventListener("change", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    mq?.removeEventListener("change", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
