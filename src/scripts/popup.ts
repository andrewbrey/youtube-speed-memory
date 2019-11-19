import { browser } from 'webextension-polyfill-ts';

(async () => {
	const BG = await browser.runtime.getBackgroundPage();
	BG.console.log('Hello from the Popup Page');
})();
