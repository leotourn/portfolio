import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { VirtualTourPlugin } from "@photo-sphere-viewer/virtual-tour-plugin";

const viewer = new Viewer({
    container: document.querySelector("#viewer"),
    defaultZoomLvl: 10,
    navbar: [
        "zoom",
    /*  {
            id: "btn-inicio",
            title: "Ir al inicio",
            content: '<img src="img/icons/home.svg" width="20" height="20" alt="">',
            className: "btn-inicio",
            onClick: (viewer) => {
                viewer.getPlugin(VirtualTourPlugin).setCurrentNode("acceso");
            }
        },
        "caption",
        */
        "fullscreen",
    ],
    plugins: [
        MarkersPlugin, // el tour lo necesita
        [
            VirtualTourPlugin,
            {
                positionMode: "manual", // nosotros decidimos dónde va cada flecha
                renderMode: "3d", // flechas pegadas al piso
                startNodeId: "acceso",
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
                        links: [{ nodeId: "pasillo", position: { yaw: "330deg", pitch: "0deg" } }]
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
const tour = viewer.getPlugin(VirtualTourPlugin);
const botones = document.querySelectorAll('#menu button');

botones.forEach((btn) => {
  btn.addEventListener('click', () => tour.setCurrentNode(btn.dataset.nodo));
});

// Resalta el botón de la habitación actual
tour.addEventListener('node-changed', ({ node }) => {
  botones.forEach((b) => b.classList.toggle('activo', b.dataset.nodo === node.id));
});
