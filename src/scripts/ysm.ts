import { noop } from 'lodash';
import { browser } from 'webextension-polyfill-ts';
import { DebugLogger } from './lib/debug/logger';
import { FROM_BG } from './lib/message/message.constants';
import { pageChangedHandler } from './lib/page/handler/page-changed';
import { PageState } from './lib/page/state';
import { MessageAndPayload, MessageHandlerDecider, MessageHandlerMap } from './types';

(async () => {
	const LOGGER = DebugLogger.for('YSM');
	const PAGE_STATE = new PageState();

	browser.runtime.onMessage.addListener(
		async ({ msgName: MESSAGE_NAME = '', msgPayload: PAYLOAD = {} }: MessageAndPayload) => {
			LOGGER.debug(`got runtime message [${MESSAGE_NAME}]`);

			const MSG_TO_HANDLER: MessageHandlerDecider = (messageName: string) => {
				const HANDLERS: MessageHandlerMap = {
					[FROM_BG.PAGE_CHANGED]: pageChangedHandler,
				};

				return HANDLERS[messageName] || noop;
			};

			return MSG_TO_HANDLER(MESSAGE_NAME)(PAGE_STATE, PAYLOAD);
		}
	);
})();
