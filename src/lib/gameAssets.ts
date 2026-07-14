import { mapPoints } from '../data/mapPoints';

/** Todas las imágenes estáticas del juego, en alta calidad. */
export const GAME_ASSETS = {
	start: [
		'/images/logos-finales.png',
		'/images/home-background.png',
		'/images/logo.png',
	],
	map: [
		'/images/camino-mapa.png',
		'/images/boton-de-flecha.png',
	],
	quiz: ['/images/SAFE_HD_Emblem+Title_White_GreenBG.png'],
	thanks: ['/images/Gracias.png'],
	mapPoints: mapPoints.map((point) => point.background),
} as const;

export const ALL_GAME_IMAGES = [
	...new Set([
		...GAME_ASSETS.start,
		...GAME_ASSETS.map,
		...GAME_ASSETS.quiz,
		...GAME_ASSETS.thanks,
		...GAME_ASSETS.mapPoints,
	]),
];
