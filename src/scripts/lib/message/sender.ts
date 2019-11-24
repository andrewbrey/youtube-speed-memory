import { browser } from 'webextension-polyfill-ts';
import { FROM_BG, TO_BG } from './message.constants';

export class MessageSender {
	static async pageChanged(tabId: number, msgPayload: any = null) {
		return tabId !== browser.tabs.TAB_ID_NONE
			? await browser.tabs.sendMessage(tabId, { msgName: FROM_BG.PAGE_CHANGED, msgPayload })
			: false;
	}

	static async closePopup(tabId: number, msgPayload: any = null) {
		return tabId !== browser.tabs.TAB_ID_NONE
			? await browser.tabs.sendMessage(tabId, { msgName: FROM_BG.CLOSE_POPUP, msgPayload })
			: false;
	}

	static async whatSpeed(msgPayload: any = null) {
		return await browser.runtime.sendMessage({ msgName: TO_BG.WHAT_SPEED, msgPayload });
	}
}
