/* ============================================
   THEME INIT — se ejecuta ANTES de pintar la página
   ============================================
   Lee el tema guardado y escribe su <link> en el <head>.
   Es síncrono a propósito: así el visitante nunca ve un
   destello del diseño por defecto al cambiar de página.
   El cambio en caliente (botones) está en main.js.
   Para añadir un tema: crea css/themes/<nombre>.css,
   agrégalo a THEMES y añade su botón en src/partials/menu.html
   ============================================ */

(() => {
    const STORAGE_KEY = "portfolio:theme";
    const DEFAULT_THEME = "editorial";
    const THEMES = ["editorial", "brutalista"];

    let theme = DEFAULT_THEME;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (THEMES.includes(saved)) theme = saved;
    } catch {
        /* sin acceso a storage: tema por defecto */
    }

    document.documentElement.dataset.theme = theme;
    document.write(`<link rel="stylesheet" id="theme-css" href="css/themes/${theme}.css">`);
})();
