const debounce = <T extends any[]>(func: (...args: T) => void, delay: number) => {
	let timeoutId: number | undefined;
	return function (...args: T) {
		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
		}
		timeoutId = window.setTimeout(() => func(...args), delay);
	};
};

export default debounce;
