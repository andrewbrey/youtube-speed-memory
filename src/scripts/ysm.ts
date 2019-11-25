import { noop } from 'lodash';
import { browser } from 'webextension-polyfill-ts';
import { FROM_BG } from './lib/message/message.constants';
import { pageChangedHandler } from './lib/page/handler/page-changed';
import { MessageAndPayload } from './types';

(async () => {
	browser.runtime.onMessage.addListener(
		async ({ msgName: MESSAGE_NAME = '', msgPayload: PAYLOAD = {} }: MessageAndPayload) => {
			const MSG_TO_HANDLER = (messageName: string) => {
				return (
					{
						[FROM_BG.PAGE_CHANGED]: pageChangedHandler,
					}[messageName] || noop
				);
			};

			return MSG_TO_HANDLER(MESSAGE_NAME)(PAYLOAD);
		}
	);
})();
