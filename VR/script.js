document.addEventListener('DOMContentLoaded', () => {
    const basePath = '/portfolio/VR/';
    let currentScene = 'hall';

    // Configuración de zoom por escena
    const sceneConfig = {
        hall: {
            zoom: 0, // Zoom normal para ver toda la habitación
            fov: 75   // Campo de visión amplio
        },
        comedor: {
            zoom: 0, // Más acercado para ver detalles de la mesa
            fov: 50   // Campo de visión más cerrado
        }
    };

    const viewer = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#viewer'),
        panorama: basePath + 'assets/hall.jpg',
        navbar: ['zoom', 'move', 'fullscreen'],
        loadingImg: 'https://photo-sphere-viewer.js.org/assets/loader.gif',
        defaultZoomLvl: 25, // Zoom inicial (0-100)
        minFov: 30,         // Zoom máximo permitido (más cerrado)
        maxFov: 90,         // Zoom mínimo permitido (más abierto)
        plugins: [
            [PhotoSphereViewer.MarkersPlugin, {
                markers: [
                    {
                        id: 'marker-comedor',
                        position: { yaw: -2, pitch: -0.2 },
                        html: '<div style="background: red; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">IR AL COMEDOR</div>',
                        anchor: 'center center',
                        tooltip: 'Haz clic para ir al comedor'
                    }
                ]
            }]
        ]
    });

    const markersPlugin = viewer.getPlugin(PhotoSphereViewer.MarkersPlugin);

    function updateMarkers(sceneName) {
        currentScene = sceneName;
        markersPlugin.clearMarkers();

        // Aplicar el zoom configurado para esta escena con animación suave
        const config = sceneConfig[sceneName];
        if (config) {
            viewer.animate({
                zoom: config.zoom,
                duration: 1500 // Duración de la animación en milisegundos
            });
        }

        if (sceneName === 'hall') {
            markersPlugin.addMarker({
                id: 'marker-comedor',
                position: { yaw: Math.PI / 2, pitch: 0 },
                html: '<div style="background: red; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">IR AL COMEDOR</div>',
                anchor: 'center center',
                tooltip: 'Haz clic para ir al comedor'
            });
        } else if (sceneName === 'comedor') {
            markersPlugin.addMarker({
                id: 'marker-hall',
                position: { yaw: -Math.PI / 2, pitch: 0 },
                html: '<div style="background: blue; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">VOLVER AL HALL</div>',
                anchor: 'center center',
                tooltip: 'Haz clic para volver al hall'
            });
        }
    }

    markersPlugin.addEventListener('select-marker', (e) => {
        if (e.marker.id === 'marker-comedor') {
            viewer.setPanorama(basePath + 'assets/comedor.jpg');
            setTimeout(() => updateMarkers('comedor'), 800);
        } else if (e.marker.id === 'marker-hall') {
            viewer.setPanorama(basePath + 'assets/hall.jpg');
            setTimeout(() => updateMarkers('hall'), 800);
        }
    });

    viewer.addEventListener('ready', () => {
        updateMarkers('hall');
    });
});
