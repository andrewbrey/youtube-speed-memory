import { ActiveTabMetadata, PageWithState, SpeedAndSubset } from 'src/scripts/types';
import { DebugLogger } from '../../debug/logger';
import { MessageSender } from '../../message/sender';

export async function pageChangedHandler(pageState: PageWithState) {
	const LOGGER = DebugLogger.for('pageChangedHandler');

	const [CURRENT_SPEED, VIDEO_ID, CHANNEL_ID, PLAYLIST_ID] = await Promise.all([
		pageState.currentPlayerSpeed(),
		pageState.videoId(),
		pageState.channelId(),
		pageState.playlistId(),
	]);

	const CURRENT_TAB_METADATA: ActiveTabMetadata = {
		current: CURRENT_SPEED,
		videoId: VIDEO_ID,
		channelId: CHANNEL_ID,
		playlistId: PLAYLIST_ID,
	};

	LOGGER.debug('current tab metadata', CURRENT_TAB_METADATA);

	const SPEED_AND_SUBSET: SpeedAndSubset = await MessageSender.speedAndSubset(CURRENT_TAB_METADATA);

	LOGGER.log('resulting speed and subset', SPEED_AND_SUBSET);

	pageState.setPlayerSpeed(SPEED_AND_SUBSET.speed);
	pageState.skipToTime(SPEED_AND_SUBSET.start);
	pageState.setEndTime(SPEED_AND_SUBSET.end);
}
