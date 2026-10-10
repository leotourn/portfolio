document.addEventListener('DOMContentLoaded', () => {
    // 1. Detectar automáticamente si estás en Local o en GitHub Pages
    const hostname = window.location.hostname;
    const basePath = (hostname === 'localhost' || hostname === '127.0.0.1') ? 'assets/' : '/portfolio/VR/assets/';

    // 2. CONFIGURACIÓN DE TODAS LAS ESCENAS
    const scenes = {
        acceso: {
            panorama: basePath + '0001.jpg',
            zoom: 0,
            fov: 100,
            markers: [
                {
                    id: 'marker-hall',
                    position: { yaw: 0, pitch: 0 },
                    html: '<div class="vr-button">ENTRAR</div>', // ¡Mucho más limpio!
                    tooltip: 'Haz clic para entrar',
                    targetScene: 'hall'
                }
            ]
        },
        hall: {
            panorama: basePath + '0002.jpg',
            zoom: 0,
            fov: 100,
            markers: [
                {
                    id: 'marker-comedor',
                    position: { yaw: -Math.PI / 2, pitch: 0 },
                    html: '<div class="vr-button">IR AL COMEDOR</div>',
                    tooltip: 'Haz clic para ir al Comedor',
                    targetScene: 'comedor'
                },
                {
                    id: 'marker-pasillo',
                    position: { yaw: Math.PI / 2, pitch: 0 },
                    html: '<div class="vr-button">IR AL PASILLO</div>',
                    tooltip: 'Haz clic para ir al Pasillo',
                    targetScene: 'pasillo'
                },
                {
                    id: 'marker-acceso-desde-hall',
                    position: { yaw: Math.PI, pitch: 0 },
                    html: '<div class="vr-button">SALIR</div>',
                    tooltip: 'Haz clic para salir',
                    targetScene: 'acceso'
                }
            ]
        },
        comedor: {
            panorama: basePath + '0003.jpg',
            zoom: 0,
            fov: 100,
            markers: [
                {
                    id: 'marker-cocina',
                    position: { yaw: Math.PI, pitch: 0 },
                    html: '<div class="vr-button">IR A LA COCINA</div>',
                    tooltip: 'Haz clic para ir a la cocina',
                    targetScene: 'cocina'
                },
                {
                    id: 'marker-hall-desde-comedor',
                    position: { yaw: Math.PI / 2, pitch: 0 },
                    html: '<div class="vr-button">VOLVER AL HALL</div>',
                    tooltip: 'Haz clic para volver al hall',
                    targetScene: 'hall'
                }
            ]
        },
        cocina: {
            panorama: basePath + '0004.jpg',
            zoom: 0,
            fov: 70,
            markers: [
                {
                    id: 'marker-comedor-desde-cocina',
                    position: { yaw: 0, pitch: 0 },
                    html: '<div class="vr-button">VOLVER AL COMEDOR</div>',
                    tooltip: 'Haz clic para volver al comedor',
                    targetScene: 'comedor'
                }
            ]
        },
        pasillo: {
            panorama: basePath + '0005.jpg',
            zoom: 0,
            fov: 70,
            markers: [
                {
                    id: 'marker-hall-desde-pasillo',
                    position: { yaw: -Math.PI / 2, pitch: 0 },
                    html: '<div class="vr-button">VOLVER AL HALL</div>',
                    tooltip: 'Haz clic para volver al hall',
                    targetScene: 'hall'
                },
                {
                    id: 'marker-dormitorio',
                    position: { yaw: Math.PI / 2, pitch: 0 },
                    html: '<div class="vr-button">IR AL DORMITORIO</div>',
                    tooltip: 'Haz clic para ir al dormitorio',
                    targetScene: 'dormitorio'
                }
            ]
        },
        dormitorio: {
            panorama: basePath + '0006.jpg',
            zoom: 0,
            fov: 70,
            markers: [
                {
                    id: 'marker-pasillo-desde-dormitorio',
                    position: { yaw: -Math.PI / 2, pitch: 0 },
                    html: '<div class="vr-button">VOLVER AL PASILLO</div>',
                    tooltip: 'Haz clic para volver al pasillo',
                    targetScene: 'pasillo'
                }
            ]
        }
    };

    let currentSceneId = 'acceso';

    // 3. Inicializar el Visor
    const viewer = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#viewer'),
        panorama: scenes[currentSceneId].panorama,
        navbar: ['zoom', 'move', 'fullscreen'],
        loadingImg: 'https://photo-sphere-viewer.js.org/assets/loader.gif',
        defaultZoomLvl: 0,
        minFov: 30,
        maxFov: 100, // Ajustado para que coincida con tu fov inicial de 100
        plugins: [
            [PhotoSphereViewer.MarkersPlugin, {}]
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
        viewer.setPanorama(scene.panorama);
        markersPlugin.clearMarkers();

        scene.markers.forEach(markerData => {
            markersPlugin.addMarker({
                id: markerData.id,
                position: markerData.position,
                html: markerData.html,
                tooltip: markerData.tooltip,
                anchor: 'center center'
            });
        });

        viewer.animate({
            zoom: scene.zoom,
            duration: 1500 // 1.5 segundos (4500 era un poco lento para la navegación)
        });
    }

    // 5. Evento: Al hacer clic en un botón/marker
    markersPlugin.addEventListener('select-marker', (e) => {
        const currentSceneData = scenes[currentSceneId];
        const clickedMarker = currentSceneData.markers.find(m => m.id === e.marker.id);

        if (clickedMarker && clickedMarker.targetScene) {
            loadScene(clickedMarker.targetScene);
        }
    });

    // 6. Iniciar el tour
    viewer.addEventListener('ready', () => {
        loadScene('acceso');
    });
});
