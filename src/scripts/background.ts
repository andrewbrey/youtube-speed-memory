import { browser } from 'webextension-polyfill-ts';

browser.runtime.onInstalled.addListener(() => {
	console.log('onInstalled....');
});
