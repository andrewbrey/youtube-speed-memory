import { browser } from 'webextension-polyfill-ts';

const YOUTUBE_WITH_VIDEO = /^.+:\/\/.+youtube.com.*v=.*$/;

browser.runtime.onInstalled.addListener(async () => {
	const EXISTING_YT_TABS = await browser.tabs.query({ active: true, url: ['*://*.youtube.com/*'] });

	// TODO(refactor) remove duplication
	EXISTING_YT_TABS.forEach(async ({ id: TAB_ID = browser.tabs.TAB_ID_NONE, url: TAB_URL = '' }) => {
		try {
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
});

browser.tabs.onActivated.addListener(async ({ tabId }) => {
	try {
		const { id: TAB_ID = browser.tabs.TAB_ID_NONE, url: TAB_URL = '' } = await browser.tabs.get(tabId);

		// TODO(refactor) remove duplication
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
