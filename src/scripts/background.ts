import { noop } from 'lodash';
import { browser } from 'webextension-polyfill-ts';
import { DebugLogger } from './lib/debug/logger';
import { EventualMemoryLiaison } from './lib/memory/liaison';
import { TO_BG } from './lib/message/message.constants';
import { MessageSender } from './lib/message/sender';
import { SpeedResolver } from './lib/speed/resolver';
import { ActiveTabMetadata, MessageAndPayload } from './types';

const ANY_YOUTUBE_TAB_QUERY = '*://*.youtube.com/*';
const YOUTUBE_WITH_VIDEO = /^.+:\/\/.+youtube.com.*v=.*$/;
const LOGGER = DebugLogger.for('BACKGROUND');

browser.runtime.onInstalled.addListener(async () => {
	const EXISTING_YT_TABS = await browser.tabs.query({ active: true, url: [ANY_YOUTUBE_TAB_QUERY] });

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
			LOGGER.error(e);
		}
	});
});

browser.tabs.onActivated.addListener(async ({ tabId }) => {
	try {
		const { id: TAB_ID = browser.tabs.TAB_ID_NONE, url: TAB_URL = '' } = await browser.tabs.get(tabId);

		if (TAB_URL.match(YOUTUBE_WITH_VIDEO)) {
			browser.pageAction.show(TAB_ID);
			browser.pageAction.setTitle({ tabId: TAB_ID, title: 'YouTube Speed Memory is Active!' });
		} else {
			browser.pageAction.hide(TAB_ID);
			browser.pageAction.setTitle({ tabId: TAB_ID, title: 'YouTube Speed Memory is Inactive' });
		}
	} catch (e) {
		LOGGER.error(e);
	}
});

browser.tabs.onUpdated.addListener(
	async (TAB_ID = browser.tabs.TAB_ID_NONE, { status: CHANGE_STATUS = '' }, { url: TAB_URL = '' }) => {
		try {
			if (TAB_URL.match(YOUTUBE_WITH_VIDEO)) {
				browser.pageAction.show(TAB_ID);
				browser.pageAction.setTitle({ tabId: TAB_ID, title: 'YouTube Speed Memory is Active!' });

				if (CHANGE_STATUS === 'complete') {
					MessageSender.pageChanged(TAB_ID);
				}
			} else {
				browser.pageAction.hide(TAB_ID);
				browser.pageAction.setTitle({ tabId: TAB_ID, title: 'YouTube Speed Memory is Inactive' });
			}
		} catch (e) {
			LOGGER.error(e);
		}
	}
);

browser.runtime.onMessage.addListener(
	async ({ msgName: MESSAGE_NAME = '', msgPayload: PAYLOAD = {} }: MessageAndPayload) => {
		const MSG_TO_HANDLER = (messageName: string) => {
			return (
				{
					[TO_BG.WHAT_SPEED]: async ({ current, videoId = '', channelId = '', playlistId = '' }: ActiveTabMetadata) => {
						const MEMORY_LIAISON = await EventualMemoryLiaison;

						return SpeedResolver.resolve({
							current,
							enabled: MEMORY_LIAISON.getEnabled(),
							baseline: MEMORY_LIAISON.getBaseline(),
							video: MEMORY_LIAISON.getVideoMemory(videoId),
							channel: MEMORY_LIAISON.getChannelMemory(channelId),
							playlist: MEMORY_LIAISON.getPlaylistMemory(playlistId),
						});
					},
				}[messageName] || noop
			);
		};

		return MSG_TO_HANDLER(MESSAGE_NAME)(PAYLOAD);
	}
);
