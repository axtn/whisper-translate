import { v2 } from '@google-cloud/translate';
import { API_KEY, PROJECT_ID } from '$env/static/private';

const { Translate } = v2;

// Creates a client
const googleTranslate = new Translate({
	key: API_KEY,
	projectId: PROJECT_ID
});

export default googleTranslate;
