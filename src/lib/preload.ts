import { DOM_IMAGES, JS_PRELOAD_IMAGES } from './gameAssets';

interface GameImageCache {
	loaded: Set<string>;
	pending: Map<string, Promise<void>>;
}

declare global {
	interface Window {
		__gameImageCache?: GameImageCache;
		__gamePreloadStarted?: boolean;
	}
}

function getCache(): GameImageCache {
	if (!window.__gameImageCache) {
		window.__gameImageCache = {
			loaded: new Set<string>(),
			pending: new Map<string, Promise<void>>(),
		};
	}
	return window.__gameImageCache;
}

function normalizeSrc(src: string): string {
	if (src.startsWith('/')) return src;
	try {
		return new URL(src, window.location.origin).pathname;
	} catch {
		return src;
	}
}

/** Marca como cargadas las imágenes que el HTML ya pidió al navegador. */
function registerDomImages(): void {
	const { loaded } = getCache();

	document.querySelectorAll('img[src]').forEach((node) => {
		const img = node as HTMLImageElement;
		const src = img.getAttribute('src');
		if (!src) return;

		const normalized = normalizeSrc(src);
		if (img.complete && img.naturalWidth > 0) {
			loaded.add(normalized);
			return;
		}

		img.addEventListener(
			'load',
			() => {
				loaded.add(normalized);
			},
			{ once: true },
		);
	});
}

export function preloadImage(src: string): Promise<void> {
	const normalized = normalizeSrc(src);
	const { loaded, pending } = getCache();

	if (loaded.has(normalized)) return Promise.resolve();

	const existing = pending.get(normalized);
	if (existing) return existing;

	const promise = new Promise<void>((resolve) => {
		const img = new Image();
		img.decoding = 'async';
		img.onload = () => {
			loaded.add(normalized);
			pending.delete(normalized);
			resolve();
		};
		img.onerror = () => {
			pending.delete(normalized);
			resolve();
		};
		img.src = normalized;
	});

	pending.set(normalized, promise);
	return promise;
}

function preloadMany(sources: readonly string[]): Promise<void[]> {
	const unique = [...new Set(sources.map(normalizeSrc))];
	return Promise.all(unique.map(preloadImage));
}

let preloadStarted = false;

/** Precarga solo imágenes que no están ya en <img> del HTML. */
export function preloadGameImages(): void {
	if (window.__gamePreloadStarted || preloadStarted) return;
	window.__gamePreloadStarted = true;
	preloadStarted = true;

	registerDomImages();
	DOM_IMAGES.forEach((src) => getCache().loaded.add(normalizeSrc(src)));
	void preloadMany(JS_PRELOAD_IMAGES);
}

export function isImageReady(src: string): boolean {
	return getCache().loaded.has(normalizeSrc(src));
}

export function whenImagesReady(sources: readonly string[]): Promise<void[]> {
	return preloadMany(sources);
}
