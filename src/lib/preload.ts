import { ALL_GAME_IMAGES, GAME_ASSETS } from './gameAssets';

const loaded = new Set<string>();
const pending = new Map<string, Promise<void>>();

export function preloadImage(src: string): Promise<void> {
	if (loaded.has(src)) return Promise.resolve();

	const existing = pending.get(src);
	if (existing) return existing;

	const promise = new Promise<void>((resolve) => {
		const img = new Image();
		img.decoding = 'async';
		img.onload = () => {
			loaded.add(src);
			pending.delete(src);
			resolve();
		};
		img.onerror = () => {
			pending.delete(src);
			resolve();
		};
		img.src = src;
	});

	pending.set(src, promise);
	return promise;
}

function preloadMany(sources: readonly string[]): Promise<void[]> {
	return Promise.all(sources.map(preloadImage));
}

/** Precarga todas las imágenes del juego (igual que los 12 fondos del mapa). */
export function preloadGameImages(): void {
	void preloadMany(ALL_GAME_IMAGES);
}

export function preloadScreenImages(screen: 'map' | 'quiz' | 'thanks'): void {
	switch (screen) {
		case 'map':
			void preloadMany([...GAME_ASSETS.map, ...GAME_ASSETS.mapPoints]);
			break;
		case 'quiz':
			void preloadMany(GAME_ASSETS.quiz);
			break;
		case 'thanks':
			void preloadMany(GAME_ASSETS.thanks);
			break;
	}
}

export function isImageReady(src: string): boolean {
	return loaded.has(src);
}

export function whenImagesReady(sources: readonly string[]): Promise<void[]> {
	return preloadMany(sources);
}

export { ALL_GAME_IMAGES };
