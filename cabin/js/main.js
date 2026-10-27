import { Viewer } from '@photo-sphere-viewer/core';

const viewer = new Viewer({
    container: document.querySelector('#viewer'),
    panorama: 'img/0001.jpg',
    caption: 'Living',
    navbar: false,          //ocultar barra de navegación
    defaultYaw: '0deg',     // hacia donde mira al cargar (horizontal)
    defaultPitch: '0deg',   // arriba/abajo
    defaultZoomLvl: 15,     // 0 = muy abierto, 100 = muy cerca
});
