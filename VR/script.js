document.addEventListener('DOMContentLoaded', () => {
    const basePath = '/portfolio/VR/';

    const nodes = [
        {
            id: 'hall',
            name: 'Hall de Acceso',
            panorama: basePath + 'assets/hall.jpg',
            links: [
                {
                    target: 'comedor',
                    position: { yaw: Math.PI / 2, pitch: 0 },
                    name: 'Ir al Comedor'
                }
            ]
        },
        {
            id: 'comedor',
            name: 'Comedor',
            panorama: basePath + 'assets/comedor.jpg',
            links: [
                {
                    target: 'hall',
                    position: { yaw: -Math.PI / 2, pitch: 0 },
                    name: 'Volver al Hall'
                }
            ]
        }
    ];

    const viewer = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#viewer'),
        panorama: basePath + 'assets/hall.jpg', // Panorama inicial
        plugins: [
            [PhotoSphereViewer.VirtualTourPlugin, {
                nodes: nodes,
                defaultNode: 'hall',
                renderMode: '3d'
            }]
        ],
        navbar: ['zoom', 'move', 'fullscreen', 'gyroscope'], // Barra de navegación integrada
        loadingImg: 'https://photo-sphere-viewer.js.org/assets/loader.gif'
    });
});
