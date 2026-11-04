import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { VirtualTourPlugin } from "@photo-sphere-viewer/virtual-tour-plugin";
import { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";

// Todos los datos del recorrido vienen de tour.json (generado desde el Excel)
const cfg = await (await fetch("tour.json")).json();
if (cfg.titulo) document.title = cfg.titulo;

const PLANTAS = Object.fromEntries(cfg.plantas.map((p) => [p.id, p]));
const nodes = cfg.escenas.map((e) => ({
    id: e.id,
    panorama: e.panorama,
    name: e.nombre,
    caption: e.caption || e.nombre,
    map: { x: e.x, y: e.y },
    data: { giro: e.giro || 0, planta: e.planta },
    links: e.links.map((l) => ({ nodeId: l.a, position: { yaw: l.yaw + "deg", pitch: l.pitch + "deg" } })),
}));

const menu = document.querySelector("#menu");
const etiqueta = document.createElement("span");
etiqueta.textContent = "Ubicaciones ▾";
const esMovil = window.matchMedia("(max-width: 600px), (pointer: coarse)").matches;

const botonInicio = {
    id: "btn-inicio",
    title: "Ir al inicio",
    content: '<img src="img/icons/home.svg" width="20" height="20" alt="">',
    className: "btn-inicio",
    onClick: (v) => v.getPlugin(VirtualTourPlugin).setCurrentNode(cfg.inicio),
};
const botonUbicaciones = {
    id: "btn-ubicaciones",
    title: "Ir a otra habitación",
    content: etiqueta,
    className: "btn-ubicaciones",
    onClick: () => menu.classList.toggle("abierto"),
};

const viewer = new Viewer({
    container: document.querySelector("#viewer"),
    defaultZoomLvl: 10,
    navbar: esMovil
        ? [botonInicio, botonUbicaciones, "gyroscope", "fullscreen"]
        : ["zoom", botonInicio, botonUbicaciones, "gyroscope", "fullscreen"],
    plugins: [
        MarkersPlugin,
        [GyroscopePlugin, { touchmove: true, roll: true, absolutePosition: false, moveMode: "smooth" }],
        [VirtualTourPlugin, {
            positionMode: "manual",
            renderMode: "2d",
            startNodeId: cfg.inicio,
            arrowStyle: {
                image: "img/icons/disco.svg",
                size: esMovil ? { width: 32, height: 32 } : { width: 48, height: 48 },
                className: "disco-link",
                style: { filter: "none" },
            },
            nodes,
        }],
    ],
});

viewer.container.appendChild(menu);
["pointerdown", "pointermove", "pointerup", "touchstart", "touchmove", "touchend", "mousedown", "wheel"]
    .forEach((ev) => menu.addEventListener(ev, (e) => e.stopPropagation(), { passive: true }));
document.addEventListener("pointerdown", (e) => {
    if (!menu.contains(e.target) && !e.target.closest(".btn-ubicaciones")) menu.classList.remove("abierto");
});

const tour = viewer.getPlugin(VirtualTourPlugin);

// Menú agrupado por planta
cfg.plantas.forEach((p) => {
    const titulo = document.createElement("div");
    titulo.className = "menu-planta";
    titulo.textContent = p.nombre;
    menu.appendChild(titulo);
    cfg.escenas.filter((e) => e.planta === p.id).forEach((e) => {
        const b = document.createElement("button");
        b.dataset.nodo = e.id;
        b.textContent = e.nombre;
        menu.appendChild(b);
    });
});
const botones = menu.querySelectorAll("button");
botones.forEach((b) => b.addEventListener("click", () => {
    tour.setCurrentNode(b.dataset.nodo);
    menu.classList.remove("abierto");
}));

// ====== PLANO ======
const ROTACION_PLANO = cfg.rotacionPlano || 0;
const plano = document.querySelector("#plano");
const planoImg = document.querySelector("#plano-img");
const planoPunto = document.querySelector("#plano-punto");
const planoCono = document.querySelector("#plano-cono");
viewer.container.appendChild(plano);

let nodoActual = null;
let plantaActual = null;
cfg.plantas.forEach((p) => { new Image().src = p.plano; });

function mostrarPlanta(planta) {
    if (planta === plantaActual) return false;
    plantaActual = planta;
    plano.classList.add("cambiando");
    planoImg.src = PLANTAS[planta].plano;
    return true;
}
function moverPunto() {
    if (!nodoActual || !nodoActual.map || !planoImg.naturalWidth) return;
    planoPunto.style.left = (nodoActual.map.x / planoImg.naturalWidth) * 100 + "%";
    planoPunto.style.top = (nodoActual.map.y / planoImg.naturalHeight) * 100 + "%";
}
function girarAbanico() {
    const grados = (viewer.getPosition().yaw * 180) / Math.PI;
    const giroNodo = (nodoActual && nodoActual.data && nodoActual.data.giro) || 0;
    planoCono.style.transform = `rotate(${grados + ROTACION_PLANO + giroNodo}deg)`;
}
planoImg.addEventListener("load", () => {
    planoPunto.style.transition = "none";
    moverPunto();
    void planoPunto.offsetWidth;
    planoPunto.style.transition = "";
    plano.classList.remove("cambiando");
});
viewer.addEventListener("position-updated", girarAbanico);

tour.addEventListener("node-changed", ({ node }) => {
    etiqueta.textContent = `${node.caption || node.name} ▾`;
    botones.forEach((b) => b.classList.toggle("activo", b.dataset.nodo === node.id));
    nodoActual = node;
    const planta = node.data && node.data.planta;
    if (!PLANTAS[planta]) { console.warn(`El nodo "${node.id}" tiene una planta inválida:`, planta); return; }
    if (!mostrarPlanta(planta)) moverPunto();
    girarAbanico();
});
