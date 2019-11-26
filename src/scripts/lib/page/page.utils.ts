export function elementHasSizeFilter(element: Element, index: number, elements: Element[]) {
	const CLIENT_RECT = element.getBoundingClientRect();

	return CLIENT_RECT.width > 2 && CLIENT_RECT.height > 2;
}

export function urlQuery() {
	const CURRENT_URL = new URL(window.location.href);

	return new URLSearchParams(CURRENT_URL.search);
}
