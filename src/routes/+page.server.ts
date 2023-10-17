import googleTranslate from '$lib/server/googleTranslate.js';
import type { LanguageResult } from '@google-cloud/translate/build/src/v2';

let languageCache: LanguageResult[];

export async function load() {
	if (!languageCache) {
		const [languages] = await googleTranslate.getLanguages();
		languageCache = languages;
	}

	return {
		languages: languageCache
	};
}
