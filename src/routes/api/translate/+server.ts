import { json, error } from '@sveltejs/kit';

import googleTranslate from '$lib/server/googleTranslate.js';
import { maxTranslationLength } from '$lib/config.js';
import type { TranslateApiResponse, GoogleTranslateApiTranslation } from '$lib/types.js';

const isString = (variable: any) => typeof variable === 'string';

export async function POST({ request }) {
	try {
		let { text, source, target }: { text: string; source: string; target: string } =
			await request.json();

		if (!isString(text) || !source || !isString(source) || !target || !isString(target)) {
			throw Error;
		}

		text = text.slice(0, maxTranslationLength);
		source = source.slice(0, 10).trim().toLowerCase();
		target = target.slice(0, 10).trim().toLowerCase();

		const isAutoSource = source === 'auto';

		const response: GoogleTranslateApiTranslation = await googleTranslate.translate(text, {
			...(isAutoSource ? {} : { from: source }),
			to: target
		});

		const returnObj: TranslateApiResponse = {
			translation: response[0] ?? '',
			...(isAutoSource
				? { detectedLanguageCode: response[1].data.translations[0].detectedSourceLanguage }
				: {})
		};

		return json(returnObj);
	} catch {
		throw error(500, {
			message: 'Server error'
		});
	}
}
