document.addEventListener('DOMContentLoaded', () => {
    const basePath = '/portfolio/VR/';

    // Configuración básica SIN plugins complejos
    const viewer = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#viewer'),
        panorama: basePath + 'assets/hall.jpg',
        navbar: ['zoom', 'move', 'fullscreen'],
        loadingImg: 'https://photo-sphere-viewer.js.org/assets/loader.gif'
    });

    // Agregamos hotspots manualmente después de cargar
    viewer.addEventListener('ready', () => {
        viewer.addMarker({
            id: 'marker-comedor',
            position: { yaw: Math.PI / 2, pitch: 0 },
            svg: '<div style="background: white; padding: 10px; border-radius: 50%; cursor: pointer;">→</div>',
            tooltip: 'Ir al Comedor',
            onClick: () => {
                viewer.setPanorama(basePath + 'assets/comedor.jpg');
            }
        });
    });

    // Cuando cambiamos al comedor, agregamos el marker de vuelta
    viewer.addEventListener('panorama-loaded', (e) => {
        if (e.detail.includes('comedor')) {
            setTimeout(() => {
                viewer.addMarker({
                    id: 'marker-hall',
                    position: { yaw: -Math.PI / 2, pitch: 0 },
                    svg: '<div style="background: white; padding: 10px; border-radius: 50%; cursor: pointer;">←</div>',
                    tooltip: 'Volver al Hall',
                    onClick: () => {
                        viewer.setPanorama(basePath + 'assets/hall.jpg');
                    }
                });
            }, 100);
        }
    });
});
