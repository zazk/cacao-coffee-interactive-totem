// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Evita que la auditoría del dev toolbar re-fetch imágenes en cada
	// actualización del timer del quiz (solo afecta desarrollo local).
	devToolbar: {
		enabled: false,
	},
});
