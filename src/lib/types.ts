export interface ApiResponse {
	message?: string;
}

export interface TranslateApiResponse extends ApiResponse {
	translation: string;
	detectedLanguageCode?: string;
}

export type GoogleTranslateApiTranslation = [string, GoogleTranslateApiMetadata];

interface GoogleTranslateApiMetadata {
	data: {
		translations: GoogleTranslateApiTranslationMetadata[];
	};
}

interface GoogleTranslateApiTranslationMetadata {
	translatedText: string;
	detectedSourceLanguage: string;
}
