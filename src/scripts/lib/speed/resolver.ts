import { SpeedResolverInput } from 'src/scripts/types';

export class SpeedResolver {
	static resolve({ current = 1, enabled, baseline, video, channel, playlist }: SpeedResolverInput): number {
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
		}

		return resolved;
	}
}
