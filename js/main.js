/* ============================================
   PORTFOLIO — SCRIPT PRINCIPAL
   ============================================
   Índice:
   1. Configuración
   2. Referencias al DOM
   3. Loader
   4. Cursor personalizado
   5. Menú
   6. Navegación entre pantallas (según la URL: #proyectos…)
   7. Preview de proyecto (hover en la lista)
   8. Reloj del footer
   9. Reveal al hacer scroll
   10. Selector de tema (intercambia el CSS)
   11. Inicialización
   ============================================ */

(() => {
    "use strict";

    /* ---------- 1. CONFIGURACIÓN ---------- */
    const LOADER_DELAY = 1800; // ms antes de ocultar el loader
    const THEME_STORAGE_KEY = "portfolio:theme"; // misma clave que theme-init.js
    const CURSOR_SMOOTHING = 0.2; // 0–1: más bajo = más "arrastre"
    const CURSOR_OFFSET = 5; // mitad del tamaño del cursor (10px)
    const CLOCK_TIMEZONE = "Europe/Madrid";
    const CLOCK_LABEL = "MAD";

    /* ---------- 2. REFERENCIAS AL DOM ---------- */
    const loader = document.getElementById("loader");
    const cursor = document.getElementById("cursor");
    const menuToggle = document.getElementById("menuToggle");
    const menuOverlay = document.getElementById("menuOverlay");
    const projectList = document.getElementById("projectList");
    const projectPreview = document.getElementById("projectPreview");
    const clock = document.getElementById("currentTime");

    /* ---------- 3. LOADER ---------- */
    function initLoader() {
        if (!loader) return;
        window.addEventListener("load", () => {
            setTimeout(() => loader.classList.add("done"), LOADER_DELAY);
        });
    }

    /* ---------- 4. CURSOR PERSONALIZADO ---------- */
    function initCursor() {
        if (!cursor) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            cursorX += (mouseX - cursorX) * CURSOR_SMOOTHING;
            cursorY += (mouseY - cursorY) * CURSOR_SMOOTHING;
            cursor.style.transform = `translate(${cursorX - CURSOR_OFFSET}px, ${cursorY - CURSOR_OFFSET}px)`;
            requestAnimationFrame(animate);
        }
        animate();

        document.querySelectorAll("a, button, li, .feat-item, .logo").forEach((el) => {
            el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
        });
    }

    /* ---------- 5. MENÚ ---------- */
    function setMenuOpen(isOpen) {
        menuToggle.classList.toggle("open", isOpen);
        menuOverlay.classList.toggle("open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    }

    function initMenu() {
        if (!menuToggle || !menuOverlay) return;

        menuToggle.addEventListener("click", () => {
            setMenuOpen(!menuOverlay.classList.contains("open"));
        });

        // Cualquier enlace del menú lo cierra (incluso el de la pantalla actual)
        menuOverlay.addEventListener("click", (e) => {
            if (e.target.closest("a")) setMenuOpen(false);
        });
    }

    /* ---------- 6. NAVEGACIÓN ENTRE PANTALLAS ---------- */
    // Cada pantalla es un <section class="screen" id="screen-NOMBRE">.
    // La URL (#NOMBRE) decide cuál se muestra: así funcionan el botón "atrás"
    // del navegador y los enlaces directos, p. ej. index.html#proyecto-loft-central
    const DEFAULT_SCREEN = "inicio";

    function restartHeroAnimation(screen) {
        screen.querySelectorAll(".line span").forEach((span) => {
            span.style.animation = "none";
            void span.offsetWidth; // fuerza el reflow para reiniciar la animación
            span.style.animation = "";
        });
    }

    function showScreen(requested) {
        let name = requested;
        let target = document.getElementById(`screen-${name}`);
        if (!target) {
            name = DEFAULT_SCREEN;
            target = document.getElementById(`screen-${name}`);
        }

        document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
        target.classList.add("active");
        window.scrollTo({ top: 0, behavior: "instant" });
        if (name === DEFAULT_SCREEN) restartHeroAnimation(target);

        // Marca en el menú el enlace de la pantalla actual
        menuOverlay.querySelectorAll("a").forEach((link) => {
            if (link.getAttribute("href") === `#${name}`) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
        setMenuOpen(false);
    }

    function initNavigation() {
        const showFromUrl = () => showScreen(location.hash.slice(1) || DEFAULT_SCREEN);
        window.addEventListener("hashchange", showFromUrl);
        showFromUrl();
    }

    /* ---------- 7. PREVIEW DE PROYECTO ---------- */
    function initProjectPreview() {
        if (!projectList || !projectPreview) return;

        projectList.addEventListener("mousemove", (e) => {
            projectPreview.style.left = `${e.clientX + 30}px`;
            projectPreview.style.top = `${e.clientY - 200}px`;
        });

        projectList.querySelectorAll("li").forEach((item) => {
            item.addEventListener("mouseenter", () => {
                projectPreview.className = `project-preview visible ${item.dataset.gradient}`;
            });
            item.addEventListener("mouseleave", () => {
                projectPreview.classList.remove("visible");
            });
        });
    }

    /* ---------- 8. RELOJ DEL FOOTER ---------- */
    function updateClock() {
        const time = new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: CLOCK_TIMEZONE,
        });
        clock.textContent = `${CLOCK_LABEL} ${time}`;
    }

    function initClock() {
        if (!clock) return;
        updateClock();
        setInterval(updateClock, 1000);
    }

    /* ---------- 9. REVEAL AL HACER SCROLL ---------- */
    function initScrollReveal() {
        const targets = document.querySelectorAll(".feat-item, .skills > div");
        if (!targets.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.1 }
        );

        targets.forEach((el) => {
            el.classList.add("reveal");
            observer.observe(el);
        });
    }

    /* ---------- 10. SELECTOR DE TEMA ---------- */
    // Cada tema es un CSS completo en css/themes/. theme-init.js carga el guardado
    // antes de pintar; aquí se cambia en caliente, sin recargar la página.
    function updateThemeButtons(name) {
        document.querySelectorAll("[data-theme-option]").forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.themeOption === name));
        });
    }

    function setTheme(name) {
        const currentLink = document.getElementById("theme-css");
        if (!currentLink || document.documentElement.dataset.theme === name) return;

        const nextLink = document.createElement("link");
        nextLink.rel = "stylesheet";
        nextLink.href = `css/themes/${name}.css`;
        nextLink.addEventListener("load", () => {
            // El tema anterior se quita recién cuando el nuevo está listo: sin parpadeo
            currentLink.remove();
            nextLink.id = "theme-css";
            document.documentElement.dataset.theme = name;
            updateThemeButtons(name);
        });
        nextLink.addEventListener("error", () => nextLink.remove());
        document.head.appendChild(nextLink);

        try {
            localStorage.setItem(THEME_STORAGE_KEY, name);
        } catch {
            /* sin acceso a storage: el cambio vale solo para esta página */
        }
    }

    function initThemeSwitcher() {
        updateThemeButtons(document.documentElement.dataset.theme);
        document.querySelectorAll("[data-theme-option]").forEach((button) => {
            button.addEventListener("click", () => setTheme(button.dataset.themeOption));
        });
    }

    /* ---------- 11. INICIALIZACIÓN ---------- */
    initLoader();
    initCursor();
    initMenu();
    initNavigation();
    initProjectPreview();
    initClock();
    initScrollReveal();
    initThemeSwitcher();
})();
