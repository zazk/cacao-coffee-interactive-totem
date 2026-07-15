import { mapPoints } from '../data/mapPoints';

/** Imágenes ya presentes en el HTML como <img> (el navegador las carga solo). */
export const DOM_IMAGES = [
	'/images/logos-finales.png',
	'/images/home-background.png',
	'/images/logo.png',
	'/images/boton-de-flecha.png',
	'/images/logo-para-abajo-SAFE-1.png',
	'/images/SAFE_HD_Emblem+Title_Compact_White_GreenBG.png',
] as const;

/**
 * Imágenes solo en CSS o en background dinámico: precargar con JS.
 * No duplicar las que ya están en <img>.
 */
export const JS_PRELOAD_IMAGES = [
	'/images/camino-mapa.png',
	'/images/Gracias.png',
	...mapPoints.map((point) => point.background),
] as const;

export const GAME_ASSETS = {
	start: [
		'/images/logos-finales.png',
		'/images/home-background.png',
		'/images/logo.png',
		'/images/SAFE_HD_Emblem+Title_Compact_White_GreenBG.png',
	],
	map: [
		'/images/camino-mapa.png',
		'/images/boton-de-flecha.png',
	],
	quiz: ['/images/logo-para-abajo-SAFE-1.png'],
	thanks: ['/images/Gracias.png'],
	mapPoints: mapPoints.map((point) => point.background),
} as const;

export const ALL_GAME_IMAGES = [
	...new Set([...DOM_IMAGES, ...JS_PRELOAD_IMAGES]),
];
