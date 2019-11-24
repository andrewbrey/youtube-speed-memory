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
							const YSM_VIDEO = document.querySelector('video');

							if (YSM_VIDEO) {
								const CURRENT_TAB_METADATA: ActiveTabMetadata = {
									current: YSM_VIDEO.playbackRate,
									videoId: PAGE_STATE.videoId(),
									channelId: PAGE_STATE.channelId(),
									playlistId: PAGE_STATE.playlistId(),
								};

								const NEXT_SPEED = await MessageSender.whatSpeed(CURRENT_TAB_METADATA);
								const YSM_SPEED = NEXT_SPEED;
								console.log(`Setting Speed to [${YSM_SPEED}]`);
								YSM_VIDEO.playbackRate = YSM_SPEED;
								return true;
							} else {
								return false;
							}
						},
					}[messageName] || noop
				);
			};

			return MSG_TO_HANDLER(MESSAGE_NAME)(PAYLOAD);
		}
	);
})();
