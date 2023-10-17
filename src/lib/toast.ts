import { toast } from 'svelte-french-toast';

const defaultDisplayMs = 2000;
const defaultPosition = 'top-center';

const toastWrapper = {
	success: (text: string, displayMs?: number) =>
		toast.success(text, {
			position: defaultPosition,
			duration: displayMs || defaultDisplayMs
		}),
	danger: (text: string, displayMs?: number) =>
		toast.error(text, {
			position: defaultPosition,
			duration: displayMs || defaultDisplayMs + 1000
		})
};

export default toastWrapper;
