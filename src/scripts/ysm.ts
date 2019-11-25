import { noop } from 'lodash';
import { browser } from 'webextension-polyfill-ts';
import { FROM_BG } from './lib/message/message.constants';
import { MessageSender } from './lib/message/sender';
import { PageState } from './lib/page/state';
import { ActiveTabMetadata, MessageAndPayload } from './types';

(async () => {
	const PAGE_STATE = new PageState();

	browser.runtime.onMessage.addListener(
		async ({ msgName: MESSAGE_NAME = '', msgPayload: PAYLOAD = {} }: MessageAndPayload) => {
			const MSG_TO_HANDLER = (messageName: string) => {
				return (
					{
						[FROM_BG.PAGE_CHANGED]: async (payload?: any) => {
							const [CURRENT_SPEED, VIDEO_ID, CHANNEL_ID, PLAYLIST_ID] = await Promise.all([
								PAGE_STATE.currentPlayerSpeed(),
								PAGE_STATE.videoId(),
								PAGE_STATE.channelId(),
								PAGE_STATE.playlistId(),
							]);

							const CURRENT_TAB_METADATA: ActiveTabMetadata = {
								current: CURRENT_SPEED,
								videoId: VIDEO_ID,
								channelId: CHANNEL_ID,
								playlistId: PLAYLIST_ID,
							};

							PAGE_STATE.setPlayerSpeed(await MessageSender.whatSpeed(CURRENT_TAB_METADATA));
						},
					}[messageName] || noop
				);
			};

			return MSG_TO_HANDLER(MESSAGE_NAME)(PAYLOAD);
		}
	);
})();
