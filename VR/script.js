document.addEventListener('DOMContentLoaded', () => {
    const basePath = '/portfolio/VR/';

    const viewer = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#viewer'),
        panorama: basePath + 'assets/hall.jpg',
        navbar: ['zoom', 'move', 'fullscreen'],
        loadingImg: 'https://photo-sphere-viewer.js.org/assets/loader.gif'
    });

    function addMarkersForScene(sceneName) {
        viewer.clearMarkers();

        if (sceneName === 'hall') {
            viewer.addMarker({
                id: 'marker-comedor',
                position: { yaw: 0, pitch: 0 }, // Centro de la vista
                html: '<div style="background: red; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">IR AL COMEDOR →</div>',
                anchor: 'center center',
                tooltip: 'Haz clic para ir al comedor'
            });
        } else if (sceneName === 'comedor') {
            viewer.addMarker({
                id: 'marker-hall',
                position: { yaw: 0, pitch: 0 },
                html: '<div style="background: blue; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">← VOLVER AL HALL</div>',
                anchor: 'center center',
                tooltip: 'Haz clic para volver al hall'
            });
        }
    }

    viewer.addEventListener('ready', () => {
        addMarkersForScene('hall');

        // Agregamos el evento click al marker
        viewer.on('click', (e, data) => {
            if (data && data.id === 'marker-comedor') {
                viewer.setPanorama(basePath + 'assets/comedor.jpg');
                setTimeout(() => addMarkersForScene('comedor'), 500);
            } else if (data && data.id === 'marker-hall') {
                viewer.setPanorama(basePath + 'assets/hall.jpg');
                setTimeout(() => addMarkersForScene('hall'), 500);
            }
        });
    });

    viewer.addEventListener('panorama-loaded', () => {
        const currentPanorama = viewer.getPanorama();
        if (currentPanorama.includes('comedor')) {
            addMarkersForScene('comedor');
        } else if (currentPanorama.includes('hall')) {
            addMarkersForScene('hall');
        }
    });
});
