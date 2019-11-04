import { browser } from 'webextension-polyfill-ts';

const YOUTUBE_WITH_VIDEO = /^.+:\/\/.+youtube.com.*v=.*$/;

browser.tabs.onActivated.addListener(async ({ tabId }) => {
	try {
		const { id: TAB_ID = -1, url: TAB_URL = '' } = await browser.tabs.get(tabId);

		if (TAB_URL.match(YOUTUBE_WITH_VIDEO)) {
			browser.pageAction.show(TAB_ID);
			browser.pageAction.setTitle({ tabId: TAB_ID, title: 'YouTube Speed Memory is Active!' });
		} else {
			browser.pageAction.hide(TAB_ID);
			browser.pageAction.setTitle({ tabId: TAB_ID, title: 'YouTube Speed Memory is Inactive' });
		}
	} catch (e) {
		console.error(e);
	}
});
