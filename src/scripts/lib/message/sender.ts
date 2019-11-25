import { browser } from 'webextension-polyfill-ts';
import { FROM_BG, TO_BG } from './message.constants';

export class MessageSender {
	static async pageChanged(tabId: number, msgPayload: any = null) {
		return tabId !== browser.tabs.TAB_ID_NONE
			? await browser.tabs.sendMessage(tabId, { msgName: FROM_BG.PAGE_CHANGED, msgPayload })
			: false;
	}

	static async closePopup(msgPayload: any = null) {
		return await browser.runtime.sendMessage({ msgName: FROM_BG.CLOSE_POPUP, msgPayload });
	}

	static async speedAndSubset(msgPayload: any = null) {
		return await browser.runtime.sendMessage({ msgName: TO_BG.SPEED_AND_SUBSET, msgPayload });
	}
}
