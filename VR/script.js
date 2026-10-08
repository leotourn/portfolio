document.addEventListener('DOMContentLoaded', () => {
    const basePath = '/portfolio/VR/';
    let currentScene = 'hall'; // Rastreamos la escena actual manualmente

    const viewer = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#viewer'),
        panorama: basePath + 'assets/hall.jpg',
        navbar: ['zoom', 'move', 'fullscreen'],
        loadingImg: 'https://photo-sphere-viewer.js.org/assets/loader.gif',
        plugins: [
            [PhotoSphereViewer.MarkersPlugin, {
                markers: [
                    {
                        id: 'marker-comedor',
                        position: { yaw: 0, pitch: 0 },
                        html: '<div style="background: red; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">IR AL COMEDOR →</div>',
                        anchor: 'center center',
                        tooltip: 'Haz clic para ir al comedor'
                    }
                ]
            }]
        ]
    });

    // Obtenemos la referencia al plugin de markers
    const markersPlugin = viewer.getPlugin(PhotoSphereViewer.MarkersPlugin);

    function updateMarkers(sceneName) {
        currentScene = sceneName;

        // Limpiamos todos los markers existentes
        markersPlugin.clearMarkers();

        if (sceneName === 'hall') {
            markersPlugin.addMarker({
                id: 'marker-comedor',
                position: { yaw: 0, pitch: 0 },
                html: '<div style="background: red; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">IR AL COMEDOR →</div>',
                anchor: 'center center',
                tooltip: 'Haz clic para ir al comedor'
            });
        } else if (sceneName === 'comedor') {
            markersPlugin.addMarker({
                id: 'marker-hall',
                position: { yaw: 0, pitch: 0 },
                html: '<div style="background: blue; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">← VOLVER AL HALL</div>',
                anchor: 'center center',
                tooltip: 'Haz clic para volver al hall'
            });
        }
    }

    // Evento cuando se hace clic en un marker
    markersPlugin.addEventListener('select-marker', (e) => {
        if (e.marker.id === 'marker-comedor') {
            viewer.setPanorama(basePath + 'assets/comedor.jpg');
            setTimeout(() => updateMarkers('comedor'), 800);
        } else if (e.marker.id === 'marker-hall') {
            viewer.setPanorama(basePath + 'assets/hall.jpg');
            setTimeout(() => updateMarkers('hall'), 800);
        }
    });

    // Cuando el visor esté listo
    viewer.addEventListener('ready', () => {
        updateMarkers('hall');
    });
});
