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
                    image: "img/icons/disco.png",
                    size: esMovil ? { width: 75, height: 45 } : { width: 50, height: 30 },
                },
                nodes: [
                    {
                        id: "acceso",
                        panorama: "img/0001.jpg",
                        name: "Entrada",
                        caption:"Entrada",
                        links: [{ nodeId: "pasillo", position: { yaw: "3deg", pitch: "-3deg" } }]
                    },
                    {
                        id: "pasillo",
                        panorama: "img/0002.jpg",
                        name: "Pasillo",
                        caption:"Hall de Distribución",
                        links: [
                            { nodeId: "acceso", position: { yaw: "180deg", pitch: "0deg" }},
                            { nodeId: "comedor", position: { yaw: "0deg", pitch: "0deg" }},
                            { nodeId: "living", position: { yaw: "55deg", pitch: "0deg" }},
                            { nodeId: "escalera", position: { yaw: "95deg", pitch: "0deg" }}
                        ]
                    },
                    {
                        id: "comedor",
                        panorama: "img/0003.jpg",
                        name: "Comedor",
                        caption: "Comedor",
                        links: [
                            { nodeId: "pasillo", position: { yaw: "180deg", pitch: "0deg" } },
                            { nodeId: "cocina", position: { yaw: "270deg", pitch: "0deg" } },
                            { nodeId: "deck", position: { yaw: "0deg", pitch: "0deg" } }
                        ]
                    },
                    {
                        id: "living",
                        panorama: "img/0004.jpg",
                        name: "Living",
                        links: [{ nodeId: "pasillo", position: { yaw: "325deg", pitch: "-20deg" } }],
                    //    markers: [ { id: "info-tv", position: { yaw: "0deg", pitch: "-5deg" }, html: "i", className: "mi-marker", size: { width: 34, height: 34 }, tooltip: "Televisor", content: '<h3>Televisor</h3><p>Smart TV 50".</p>', hoverScale: true } ],
                    },
                    {
                        id: "cocina",
                        panorama: "img/0005.jpg",
                        name: "Cocina",
                        links: [{ nodeId: "comedor", position: { yaw: "270deg", pitch: "0deg" } }]
                    },
                    {
                        id: "escalera",
                        panorama: "img/0006.jpg",
                        name: "Escalera",
                        links: [
                            { nodeId: "pasillo", position: { yaw: "20deg", pitch: "0deg" } },
                            { nodeId: "arriba", position: { yaw: "340deg", pitch: "0deg" } }
                        ]
                    },
                    {
                        id: "arriba",
                        panorama: "img/0007.jpg",
                        name: "Segunda Planta",
                        links: [
                            { nodeId: "escalera", position: { yaw: "135deg", pitch: "0deg" } },
                            { nodeId: "dormitorio", position: { yaw: "320deg", pitch: "0deg" } }
                        ]
                    },
                    {
                        id: "dormitorio",
                        panorama: "img/0008.jpg",
                        name: "Cuarto Principal",
                        links: [
                            { nodeId: "arriba", position: { yaw: "320deg", pitch: "0deg" } },
                            { nodeId: "terraza", position: { yaw: "180deg", pitch: "0deg" } }
                        ]
                    },
                    {
                        id: "terraza",
                        panorama: "img/0009.jpg",
                        name: "Terraza",
                        links: [
                            { nodeId: "dormitorio", position: { yaw: "180deg", pitch: "0deg" } }
                        ]
                    },
                    {
                        id: "deck",
                        panorama: "img/0010.jpg",
                        name: "Deck",
                        links: [
                            { nodeId: "comedor", position: { yaw: "180deg", pitch: "0deg" } }
                        ]
                    }
                ]
            }
        ]
    ]
});

viewer.container.appendChild(menu);

// Evita que el visor capture los toques sobre la lista de habitaciones
["pointerdown", "pointermove", "pointerup", "touchstart", "touchmove", "touchend", "mousedown", "wheel"]
    .forEach((evento) => {
        menu.addEventListener(evento, (e) => e.stopPropagation(), { passive: true });
    });

const tour = viewer.getPlugin(VirtualTourPlugin);
const botones = document.querySelectorAll("#menu button");

// Al elegir una habitación: ir a ella y cerrar el desplegable
botones.forEach((btn) => {
    btn.addEventListener("click", () => {
        tour.setCurrentNode(btn.dataset.nodo);
        menu.classList.remove("abierto");
    });
});

// Al cambiar de habitación: actualiza el texto del botón y resalta la actual
tour.addEventListener("node-changed", ({ node }) => {
    etiqueta.textContent = `${node.caption || node.name} ▾`;
    botones.forEach((b) => b.classList.toggle("activo", b.dataset.nodo === node.id));
});

// Clic fuera: cierra el desplegable
document.addEventListener("pointerdown", (e) => {
    if (!menu.contains(e.target) && !e.target.closest(".btn-ubicaciones")) {
        menu.classList.remove("abierto");
    }
});
