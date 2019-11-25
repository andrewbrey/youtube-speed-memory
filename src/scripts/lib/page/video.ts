import { DEBUG_ENABLED } from '@global/env';
import { MaybePageVideo } from 'src/scripts/types';
import { DebugLogger } from '../debug/logger';

export class PageVideo {
	private logger: DebugLogger = DebugLogger.for(this.constructor.name);
	private element: MaybePageVideo = null;

	constructor(video: MaybePageVideo) {
		this.element = video;

		if (this.element && DEBUG_ENABLED) {
			this.element.addEventListener('ratechange', () => {
				this.logger.debug(`video speed changed to [${this.element ? this.element.playbackRate : '---'}]`);
			});
		}
	}

	getPlaybackRate() {
		return this.element ? this.element.playbackRate : 1;
	}

	setPlaybackRate(rate: number) {
		this.logger.log(`setting speed to [${rate}]`);

		if (this.element) {
			this.element.playbackRate = rate;
		}
	}
}
