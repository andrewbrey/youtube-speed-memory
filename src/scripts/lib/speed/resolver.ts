import { SpeedResolverInput } from 'src/scripts/types';
import { DebugLogger } from '../debug/logger';

export class SpeedResolver {
	static resolve({ current = 1, enabled, baseline, video, channel, playlist }: SpeedResolverInput): number {
		const LOGGER = DebugLogger.for('SpeedResolver#resolve');

		LOGGER.debug('speed resolver input', { current, enabled, baseline, video, channel, playlist });

		let resolved = current || 1;

		if (enabled) {
			resolved = baseline;

			if (playlist) {
				resolved = playlist.speed;
			}

			if (channel) {
				resolved = channel.speed;
			}

			if (video) {
				resolved = video.speed;
			}
		} else {
			LOGGER.debug('extension is disabled');
		}

		LOGGER.log(`resolved speed to [${resolved}]`);

		return resolved;
	}
}
