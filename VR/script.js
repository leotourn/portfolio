document.addEventListener('DOMContentLoaded', () => {
    // 1. Detectar automáticamente si estás en Local o en GitHub Pages
    const hostname = window.location.hostname;
    const basePath = (hostname === 'localhost' || hostname === '127.0.0.1') ? 'assets/' : '/portfolio/VR/assets/';

    // 2. CONFIGURACIÓN DE TODAS LAS ESCENAS (Aquí agregas nuevas habitaciones fácilmente)
    const scenes = {
        acceso: {
            panorama: basePath + '0001.jpg',
            zoom: 50,  // Zoom normal (0-100)
            fov: 75,   // Campo de visión amplio
            markers: [
                {
                    id: 'marker-comedor',
                    position: { yaw: Math.PI / 2, pitch: 0 }, // Ajusta con el truco del clic
                    html: '<div style="background: red; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">IR AL COMEDOR →</div>',
                    tooltip: 'Haz clic para ir al comedor',
                    targetScene: 'comedor' // A dónde lleva este botón
                },
                {
                    id: 'marker-cocina',
                    position: { yaw: -Math.PI / 2, pitch: 0 },
                    html: '<div style="background: green; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">IR A LA COCINA →</div>',
                    tooltip: 'Haz clic para ir a la cocina',
                    targetScene: 'cocina'
                }
            ]
        },
        hall: {
            panorama: basePath + '0002.jpg',
            zoom: 60,
            fov: 60,
            markers: [
                {
                    id: 'marker-hall',
                    position: { yaw: -Math.PI / 2, pitch: 0 },
                    html: '<div style="background: blue; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">← VOLVER AL HALL</div>',
                    tooltip: 'Haz clic para volver al hall',
                    targetScene: 'hall'
                }
            ]
        },
        comedor: {
            panorama: basePath + '0003.jpg', // ¡Asegúrate de tener cocina.jpg en la carpeta assets!
            zoom: 50,
            fov: 70,
            markers: [
                {
                    id: 'marker-hall-desde-cocina',
                    position: { yaw: Math.PI, pitch: 0 }, // Detrás de ti
                    html: '<div style="background: blue; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">← VOLVER AL HALL</div>',
                    tooltip: 'Haz clic para volver al hall',
                    targetScene: 'hall'
                }
            ]
        },
        cocina: {
            panorama: basePath + '0004.jpg', // ¡Asegúrate de tener cocina.jpg en la carpeta assets!
            zoom: 50,
            fov: 70,
            markers: [
                {
                    id: 'marker-hall-desde-cocina',
                    position: { yaw: Math.PI, pitch: 0 }, // Detrás de ti
                    html: '<div style="background: blue; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">← VOLVER AL HALL</div>',
                    tooltip: 'Haz clic para volver al hall',
                    targetScene: 'hall'
                }
            ]
        },
        pasillo: {
            panorama: basePath + '0005.jpg', // ¡Asegúrate de tener cocina.jpg en la carpeta assets!
            zoom: 50,
            fov: 70,
            markers: [
                {
                    id: 'marker-hall-desde-cocina',
                    position: { yaw: Math.PI, pitch: 0 }, // Detrás de ti
                    html: '<div style="background: blue; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">← VOLVER AL HALL</div>',
                    tooltip: 'Haz clic para volver al hall',
                    targetScene: 'hall'
                }
            ]
        },
        dormitorio: {
            panorama: basePath + '0006.jpg', // ¡Asegúrate de tener cocina.jpg en la carpeta assets!
            zoom: 50,
            fov: 70,
            markers: [
                {
                    id: 'marker-hall-desde-cocina',
                    position: { yaw: Math.PI, pitch: 0 }, // Detrás de ti
                    html: '<div style="background: blue; color: white; padding: 15px 25px; border-radius: 30px; font-size: 18px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3); white-space: nowrap;">← VOLVER AL HALL</div>',
                    tooltip: 'Haz clic para volver al hall',
                    targetScene: 'hall'
                }
            ]
        }
    };

    let currentSceneId = 'hall';

    // 3. Inicializar el Visor
    const viewer = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#viewer'),
        panorama: scenes[currentSceneId].panorama,
        navbar: ['zoom', 'move', 'fullscreen'],
        loadingImg: 'https://photo-sphere-viewer.js.org/assets/loader.gif',
        defaultZoomLvl: 50,
        minFov: 30,
        maxFov: 90,
        plugins: [
            [PhotoSphereViewer.MarkersPlugin, {}] // Se inicializa vacío, lo llenamos dinámicamente
        ]
    });

    const markersPlugin = viewer.getPlugin(PhotoSphereViewer.MarkersPlugin);

    // 4. Función maestra para cambiar de escena
    function loadScene(sceneId) {
        const scene = scenes[sceneId];
        if (!scene) {
            console.error('La escena no existe:', sceneId);
            return;
        }

        currentSceneId = sceneId;

        // A. Cambiar la imagen de fondo
        viewer.setPanorama(scene.panorama);

        // B. Limpiar los botones (markers) de la escena anterior
        markersPlugin.clearMarkers();

        // C. Agregar los nuevos botones de esta escena
        scene.markers.forEach(markerData => {
            markersPlugin.addMarker({
                id: markerData.id,
                position: markerData.position,
                html: markerData.html,
                tooltip: markerData.tooltip,
                anchor: 'center center'
            });
        });

        // D. Animar el zoom/fov suavemente
        viewer.animate({
            zoom: scene.zoom,
            duration: 1500 // 1.5 segundos de animación
        });
    }

    // 5. Evento: Al hacer clic en un botón/marker
    markersPlugin.addEventListener('select-marker', (e) => {
        // Buscamos en la configuración actual a dónde debe llevar este marker
        const currentSceneData = scenes[currentSceneId];
        const clickedMarker = currentSceneData.markers.find(m => m.id === e.marker.id);

        if (clickedMarker && clickedMarker.targetScene) {
            loadScene(clickedMarker.targetScene);
        }
    });

    // 6. Iniciar el tour
    viewer.addEventListener('ready', () => {
        loadScene('hall');
    });
});
