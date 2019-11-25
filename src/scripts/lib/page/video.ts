import { DEBUG_ENABLED } from '@global/env';
import { MaybePageVideo } from 'src/scripts/types';

export class PageVideo {
	element: MaybePageVideo = null;

	constructor(video: MaybePageVideo) {
		this.element = video;

		if (this.element && DEBUG_ENABLED) {
			this.element.addEventListener('ratechange', () => {
				console.log(`Video speed changed! -> [${this.element ? this.element.playbackRate : '---'}]`);
			});
		}
	}

	getPlaybackRate() {
		return this.element ? this.element.playbackRate : 1;
	}

	setPlaybackRate(rate: number) {
		console.log(`Setting Speed to [${rate}]`);

		if (this.element) {
			this.element.playbackRate = rate;
		}
	}
}
