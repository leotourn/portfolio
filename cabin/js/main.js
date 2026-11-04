import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { VirtualTourPlugin } from "@photo-sphere-viewer/virtual-tour-plugin";
import { GyroscopePlugin } from "@photo-sphere-viewer/gyroscope-plugin";

const menu = document.querySelector("#menu");

// Texto del botón que reemplaza al caption
const etiqueta = document.createElement("span");
etiqueta.textContent = "Ubicaciones ▾";

// ¿Celular/tablet o pantalla angosta?
const esMovil = window.matchMedia("(max-width: 600px), (pointer: coarse)").matches;

const botonInicio = {
    id: "btn-inicio",
    title: "Ir al inicio",
    content: '<img src="img/icons/home.svg" width="20" height="20" alt="">',
    className: "btn-inicio",
    onClick: (viewer) => {
        viewer.getPlugin(VirtualTourPlugin).setCurrentNode("acceso");
    },
};

const botonUbicaciones = {
    id: "btn-ubicaciones",
    title: "Ir a otra habitación",
    content: etiqueta,
    className: "btn-ubicaciones",
    onClick: () => menu.classList.toggle("abierto"),
};

// PLANTAS !!!!!!!!

const PLANTAS = {
    baja: {
        nombre: "Planta baja",
        plano: "img/plano-baja.svg",
        nodos: [
                {
                    id: "acceso",
                    panorama: "img/0001.jpg",
                    name: "Entrada",
                    caption:"Entrada",
                    map: { x: 410, y: 1235 },
                    links: [{ nodeId: "pasillo", position: { yaw: "3deg", pitch: "3deg" } }]
                },
                {
                    id: "pasillo",
                    panorama: "img/0002.jpg",
                    name: "Pasillo",
                    caption:"Hall de Distribución",
                    map: { x: 410, y: 715 },
                    links: [
                        { nodeId: "acceso", position: { yaw: "177deg", pitch: "0deg" }},
                        { nodeId: "comedor", position: { yaw: "-1deg", pitch: "0deg" }},
                        { nodeId: "living", position: { yaw: "41deg", pitch: "0deg" }},
                        { nodeId: "escalera", position: { yaw: "93deg", pitch: "15deg" }}
                    ]
                },
                {
                    id: "comedor",
                    panorama: "img/0003.jpg",
                    name: "Comedor",
                    caption: "Comedor",
                    map: { x: 410, y: 420 },
                    links: [
                        { nodeId: "pasillo", position: { yaw: "180deg", pitch: "-2deg" } },
                        { nodeId: "cocina", position: { yaw: "-85deg", pitch: "-2deg" } },
                        { nodeId: "deck", position: { yaw: "-12deg", pitch: "-2deg" } }
                    ]
                },
                {
                    id: "living",
                    panorama: "img/0004.jpg",
                    name: "Living",
                    caption: "Living",
                    map: { x: 550, y: 550 },
                    data: { giro: 270 },
                    links: [
                        { nodeId: "pasillo", position: { yaw: "325deg", pitch: "-2deg" } },
                        { nodeId: "escalera", position: { yaw: "-103deg", pitch: "20deg" } },
                        { nodeId: "comedor", position: { yaw: "28.5deg", pitch: "-2deg" } },
                        { nodeId: "arriba", position: { yaw: "305deg", pitch: "35deg" } }
                    ],
                },
                {
                    id: "cocina",
                    panorama: "img/0005.jpg",
                    name: "Cocina",
                    caption: "Cocina",
                    map: { x: 305, y: 420 },
                    data: { giro: 180 },     // grados extra para esta habitación
                    links: [{ nodeId: "comedor", position: { yaw: "-72deg", pitch: "-2deg" } }]
                },
                {
                    id: "escalera",
                    panorama: "img/0006.jpg",
                    name: "Escalera",
                    caption: "Escalera",
                    data: {giro: 270},
                    map: { x: 580, y: 735 },
                    links: [
                        { nodeId: "pasillo", position: { yaw: "5deg", pitch: "-25deg" } },
                        { nodeId: "arriba", position: { yaw: "340deg", pitch: "20deg" } }
                    ]
                },
                {
                    id: "deck",
                    panorama: "img/0010.jpg",
                    name: "Deck",
                    caption: "Deck",
                    map: { x: 410, y: 220 },
                    links: [
                        { nodeId: "comedor", position: { yaw: "190deg", pitch: "-2deg" } }
                    ]
                }
            ]
    },
    alta: {
        nombre: "Planta alta",
        plano: "img/plano-alta.svg",
        nodos: [
                {
                    id: "arriba",
                    panorama: "img/0007.jpg",
                    name: "Planta Alta",
                    caption: "Planta Alta",
                    map: { x: 410, y: 730 },
                    links: [
                        { nodeId: "escalera", position: { yaw: "87deg", pitch: "-35deg" } },
                        { nodeId: "dormitorio", position: { yaw: "322deg", pitch: "-5deg" } }
                    ]
                },
                {
                    id: "dormitorio",
                    panorama: "img/0008.jpg",
                    name: "Cuarto Principal",
                    caption: "Cuarto Principal",
                    map: { x: 245, y: 530 },
                    data: { giro: 180 },
                    links: [
                        { nodeId: "arriba", position: { yaw: "327deg", pitch: "-5deg" } },
                        { nodeId: "terraza", position: { yaw: "170deg", pitch: "2deg" } }
                    ]
                },
                {
                    id: "terraza",
                    panorama: "img/0009.jpg",
                    name: "Terraza",
                    caption: "Terraza",
                    map: { x: 245, y: 370 },
                    links: [
                        { nodeId: "dormitorio", position: { yaw: "185deg", pitch: "-7deg" } }
                    ]
                },
        ]
    }
};

// Une todos los nodos y les asigna su planta automáticamente
const nodes = Object.entries(PLANTAS).flatMap(([planta, def]) =>
    def.nodos.map((nodo) => ({
        ...nodo,
        data: { ...nodo.data, planta },   // conserva tu "giro" y agrega la planta
    }))
);

const viewer = new Viewer({
    container: document.querySelector("#viewer"),
    defaultZoomLvl: 10,
    navbar: esMovil
        ? [botonInicio, botonUbicaciones, "gyroscope", "fullscreen"]
        : ["zoom", botonInicio, botonUbicaciones, "gyroscope", "fullscreen"],
    plugins: [
        MarkersPlugin,
        [GyroscopePlugin, {
            touchmove: true,          // permite arrastrar con el dedo mientras el giroscopio está activo
            roll: true,               // aplica la inclinación lateral del teléfono
            absolutePosition: false,  // false: parte desde donde estás mirando; true: usa la orientación real del aparato
            moveMode: "smooth",       // "smooth" suaviza el movimiento; "fast" responde al instante
        }],
        [
            VirtualTourPlugin,
            {
                positionMode: "manual",
                renderMode: "2d",
                startNodeId: "acceso",
                arrowStyle: {
                    image: "img/icons/disco.svg",
                    size: esMovil ? { width: 32, height: 32 } : { width: 48, height: 48 },
                    className: "disco-link",
                    style: { filter: "none" },      // quita la sombra
                },
                nodes,
            }
        ]
    ]
});

// FIN PLANTAS

/** BACK UP

const viewer = new Viewer({
    container: document.querySelector("#viewer"),
    defaultZoomLvl: 10,
    navbar: esMovil
        ? [botonInicio, botonUbicaciones, "gyroscope", "fullscreen"]
        : ["zoom", botonInicio, botonUbicaciones, "gyroscope", "fullscreen"],
    plugins: [
        MarkersPlugin,
        [GyroscopePlugin, {
            touchmove: true,          // permite arrastrar con el dedo mientras el giroscopio está activo
            roll: true,               // aplica la inclinación lateral del teléfono
            absolutePosition: false,  // false: parte desde donde estás mirando; true: usa la orientación real del aparato
            moveMode: "smooth",       // "smooth" suaviza el movimiento; "fast" responde al instante
        }],
        [
            VirtualTourPlugin,
            {
                positionMode: "manual",
                renderMode: "2d",
                startNodeId: "acceso",
                arrowStyle: {
                    image: "img/icons/disco.svg",
                    size: esMovil ? { width: 32, height: 32 } : { width: 48, height: 48 },
                    className: "disco-link",
                    style: { filter: "none" },      // quita la sombra
                },
                nodes: [
                    {
                        id: "acceso",
                        panorama: "img/0001.jpg",
                        name: "Entrada",
                        caption:"Entrada",
                        map: { x: 410, y: 1285 },
                        links: [{ nodeId: "pasillo", position: { yaw: "3deg", pitch: "3deg" } }]
                    },
                    {
                        id: "pasillo",
                        panorama: "img/0002.jpg",
                        name: "Pasillo",
                        caption:"Hall de Distribución",
                        map: { x: 410, y: 770 },
                        links: [
                            { nodeId: "acceso", position: { yaw: "177deg", pitch: "-10deg" }},
                            { nodeId: "comedor", position: { yaw: "-1deg", pitch: "-12deg" }},
                            { nodeId: "living", position: { yaw: "41deg", pitch: "-18deg" }},
                            { nodeId: "escalera", position: { yaw: "93deg", pitch: "9deg" }}
                        ]
                    },
                    {
                        id: "comedor",
                        panorama: "img/0003.jpg",
                        name: "Comedor",
                        caption: "Comedor",
                        map: { x: 410, y: 470 },
                        links: [
                            { nodeId: "pasillo", position: { yaw: "180deg", pitch: "-11.5deg" } },
                            { nodeId: "cocina", position: { yaw: "-85deg", pitch: "-20deg" } },
                            { nodeId: "deck", position: { yaw: "-12deg", pitch: "-12deg" } }
                        ]
                    },
                    {
                        id: "living",
                        panorama: "img/0004.jpg",
                        name: "Living",
                        caption: "Living",
                        map: { x: 550, y: 630 },
                        data: { giro: 270 },
                        links: [{ nodeId: "pasillo", position: { yaw: "325deg", pitch: "-20deg" } }],
                        },
                    {
                        id: "cocina",
                        panorama: "img/0005.jpg",
                        name: "Cocina",
                        caption: "Cocina",
                        map: { x: 310, y: 470 },
                        data: { giro: 180 },     // grados extra para esta habitación
                        links: [{ nodeId: "comedor", position: { yaw: "-66deg", pitch: "-21deg" } }]
                    },
                    {
                        id: "escalera",
                        panorama: "img/0006.jpg",
                        name: "Escalera",
                        caption: "Escalera",
                        data: {giro: 270},
                        map: { x: 580, y: 790 },
                        links: [
                            { nodeId: "pasillo", position: { yaw: "20deg", pitch: "0deg" } },
                            { nodeId: "arriba", position: { yaw: "340deg", pitch: "0deg" } }
                        ]
                    },
                    {
                        id: "arriba",
                        panorama: "img/0007.jpg",
                        name: "Planta Alta",
                        caption: "Planta Alta",
                        map: { x: 410, y: 790 },
                        links: [
                            { nodeId: "escalera", position: { yaw: "135deg", pitch: "0deg" } },
                            { nodeId: "dormitorio", position: { yaw: "320deg", pitch: "0deg" } }
                        ]
                    },
                    {
                        id: "dormitorio",
                        panorama: "img/0008.jpg",
                        name: "Cuarto Principal",
                        caption: "Cuarto Principal",
                        map: { x: 245, y: 580 },
                        data: { giro: 180 },
                        links: [
                            { nodeId: "arriba", position: { yaw: "320deg", pitch: "0deg" } },
                            { nodeId: "terraza", position: { yaw: "180deg", pitch: "0deg" } }
                        ]
                    },
                    {
                        id: "terraza",
                        panorama: "img/0009.jpg",
                        name: "Terraza",
                        caption: "Terraza",
                        map: { x: 245, y: 450 },
                        links: [
                            { nodeId: "dormitorio", position: { yaw: "180deg", pitch: "0deg" } }
                        ]
                    },
                    {
                        id: "deck",
                        panorama: "img/0010.jpg",
                        name: "Deck",
                        caption: "Deck",
                        map: { x: 410, y: 240 },
                        links: [
                            { nodeId: "comedor", position: { yaw: "190deg", pitch: "-15deg" } }
                        ]
                    }
                ]
            }
        ]
    ]
});


                FIN DEL BACK UP             **/









viewer.container.appendChild(menu);

// Evita que el visor capture los toques sobre la lista de habitaciones
["pointerdown", "pointermove", "pointerup", "touchstart", "touchmove", "touchend", "mousedown", "wheel"]
    .forEach((evento) => {
        menu.addEventListener(evento, (e) => e.stopPropagation(), { passive: true });
    });

const tour = viewer.getPlugin(VirtualTourPlugin);

// Construye el menú agrupado por planta
Object.values(PLANTAS).forEach((p) => {
    const titulo = document.createElement("div");
    titulo.className = "menu-planta";
    titulo.textContent = p.nombre;
    menu.appendChild(titulo);

    // OJO: Aquí debe decir p.nodos (asegúrate de haber cambiado "nodes" por "nodos" en el objeto PLANTAS de arriba)
    p.nodos.forEach((n) => {
        const boton = document.createElement("button");
        boton.dataset.nodo = n.id;
        boton.textContent = n.name;
        menu.appendChild(boton);
    });
});

const botones = document.querySelectorAll("#menu button");

// ¡ESTO ES LO QUE FALTABA! Asignar la acción de clic a cada botón
botones.forEach((b) => {
    b.addEventListener("click", () => {
        const idNodo = b.dataset.nodo;
        if (idNodo) {
            tour.setCurrentNode(idNodo);          // Cambia a la escena seleccionada
            menu.classList.remove("abierto");     // Cierra el menú automáticamente al elegir
        }
    });
});

// ====== PLANO PROPIO ======
const ROTACION_PLANO = 0;   // grados; ajústalo hasta que el abanico coincida con la realidad

const plano = document.querySelector("#plano");
const planoImg = document.querySelector("#plano-img");
const planoPunto = document.querySelector("#plano-punto");
const planoCono = document.querySelector("#plano-cono");
viewer.container.appendChild(plano);

let nodoActual = null;
let plantaActual = null;   // ninguna al inicio: la primera escena siempre carga su plano

// Precarga todos los planos, para que el cambio sea instantáneo
Object.values(PLANTAS).forEach((p) => { new Image().src = p.plano; });

// Cambia la imagen si la planta es distinta. Devuelve true si hubo cambio.
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
    planoPunto.style.transition = "none";   // coloca el punto sin animación
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

    if (!PLANTAS[planta]) {   // aviso útil si algo queda mal configurado
        console.warn(`El nodo "${node.id}" tiene una planta inválida:`, planta);
        return;
    }

    const cambio = mostrarPlanta(planta);
    if (!cambio) moverPunto();   // si cambió el plano, el punto se ubica al terminar de cargar
    girarAbanico();
});
