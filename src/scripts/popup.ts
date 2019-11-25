import { browser } from 'webextension-polyfill-ts';

(async () => {
	browser.runtime.sendMessage('ping');
})();
