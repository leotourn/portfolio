// Esperamos a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {

    // 1. Definimos las escenas (nodos) del tour
    const nodes = [
        {
            id: 'hall',
            name: 'Hall de Acceso',
            panorama: 'assets/hall.jpg', // Ruta a tu render de Blender
            links: [
                {
                    target: 'comedor', // ID de la escena a la que conecta
                    position: { yaw: Math.PI / 2, pitch: 0 }, // Dónde colocar el hotspot (90 grados a la derecha)
                    name: 'Ir al Comedor'
                }
            ]
        },
        {
            id: 'comedor',
            name: 'Comedor',
            panorama: 'assets/comedor.jpg',
            links: [
                {
                    target: 'hall',
                    position: { yaw: -Math.PI / 2, pitch: 0 }, // 90 grados a la izquierda
                    name: 'Volver al Hall de Acceso'
                }
            ]
        }
    ];

    // 2. Inicializamos el visor
    const viewer = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#viewer'),
        plugins: [
            [PhotoSphereViewer.VirtualTourPlugin, {
                nodes: nodes,
                defaultNode: 'hall', // Escena inicial
                renderMode: '3d' // '3d' da un efecto de profundidad al cambiar de escena
            }],
            // Opcional: Barra de navegación (brújula, zoom, pantalla completa)
            [PhotoSphereViewer.NavigationBarPlugin, {
                buttons: ['zoom', 'move', 'fullscreen']
            }]
        ],
        navbar: false, // Lo manejamos con el plugin de navegación arriba
        loadingImg: 'https://photo-sphere-viewer.js.org/assets/loader.gif'
    });
});