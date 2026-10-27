import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { VirtualTourPlugin } from "@photo-sphere-viewer/virtual-tour-plugin";

const viewer = new Viewer({
    container: document.querySelector("#viewer"),
    defaultZoomLvl: 30,
    navbar: [
        "zoom",
        {
            id: "btn-inicio",
            title: "Ir al inicio",
            content: "🏠",
            className: "btn-inicio",
            onClick: () => {
                viewer.getPlugin(VirtualTourPlugin).setCurrentNode("acceso");
            }
        },
        "caption",
        "fullscreen"
    ],
    plugins: [
        MarkersPlugin, // el tour lo necesita
        [
            VirtualTourPlugin,
            {
                positionMode: "manual", // nosotros decidimos dónde va cada flecha
                renderMode: "3d", // flechas pegadas al piso
                startNodeId: "pasillo",
                nodes: [
                    {
                        id: "acceso",
                        panorama: "img/0001.jpg",
                        name: "Entrada",
                        links: [{ nodeId: "pasillo", position: { yaw: "3deg", pitch: "-3deg" } }]
                    },
                    {
                        id: "pasillo",
                        panorama: "img/0002.jpg",
                        name: "Pasillo",
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
                        links: [{ nodeId: "pasillo", position: { yaw: "180deg", pitch: "0deg" } }]
                    },
                    {
                        id: "living",
                        panorama: "img/0004.jpg",
                        name: "Living",
                        links: [{ nodeId: "pasillo", position: { yaw: "330deg", pitch: "0deg" } }]
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
                        name: "Cuarto Principal",
                        links: [
                            { nodeId: "escalera", position: { yaw: "90deg", pitch: "0deg" } },
                        ]
                    }
                ]
            }
        ]
    ]
});
