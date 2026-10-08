document.addEventListener('DOMContentLoaded', () => {
    const basePath = '/portfolio/VR/';

    const viewer = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#viewer'),
        panorama: basePath + 'assets/hall.jpg',
        navbar: ['zoom', 'move', 'fullscreen'],
        loadingImg: 'https://photo-sphere-viewer.js.org/assets/loader.gif'
    });

    // Función para agregar markers según la escena actual
    function addMarkersForScene(sceneName) {
        // Limpiamos markers anteriores
        viewer.clearMarkers();

        if (sceneName === 'hall') {
            viewer.addMarker({
                id: 'marker-comedor',
                position: { yaw: Math.PI / 2, pitch: 0 },
                image: 'https://cdn-icons-png.flaticon.com/512/271/271220.png', // Flecha blanca
                size: { width: 48, height: 48 },
                tooltip: 'Ir al Comedor',
                anchor: 'center center',
                onClick: () => {
                    viewer.setPanorama(basePath + 'assets/comedor.jpg');
                    setTimeout(() => addMarkersForScene('comedor'), 500);
                }
            });
        } else if (sceneName === 'comedor') {
            viewer.addMarker({
                id: 'marker-hall',
                position: { yaw: -Math.PI / 2, pitch: 0 },
                image: 'https://cdn-icons-png.flaticon.com/512/271/271220.png',
                size: { width: 48, height: 48 },
                tooltip: 'Volver al Hall',
                anchor: 'center center',
                onClick: () => {
                    viewer.setPanorama(basePath + 'assets/hall.jpg');
                    setTimeout(() => addMarkersForScene('hall'), 500);
                }
            });
        }
    }

    // Cuando el visor está listo, agregamos los markers iniciales
    viewer.addEventListener('ready', () => {
        addMarkersForScene('hall');
    });

    // Cuando cambia la panorámica, actualizamos los markers
    viewer.addEventListener('panorama-loaded', () => {
        const currentPanorama = viewer.getPanorama();
        if (currentPanorama.includes('comedor')) {
            addMarkersForScene('comedor');
        } else if (currentPanorama.includes('hall')) {
            addMarkersForScene('hall');
        }
    });
});
