import { ActiveTabMetadata, SpeedAndSubset } from 'src/scripts/types';
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

	const SPEED_AND_SUBSET: SpeedAndSubset = await MessageSender.speedAndSubset(CURRENT_TAB_METADATA);

	PAGE_STATE.setPlayerSpeed(SPEED_AND_SUBSET.speed);
	PAGE_STATE.skipToTime(SPEED_AND_SUBSET.start);
	PAGE_STATE.setEndTime(SPEED_AND_SUBSET.end);
}
