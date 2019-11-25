import { ActiveTabMetadata } from 'src/scripts/types';
import { MessageSender } from '../../message/sender';
import { PageState } from '../state';

export async function pageChangedHandler(payload?: any) {
	const PAGE_STATE = new PageState();

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
}
