import { DEBUG_ENABLED } from '@global/env';
import { MaybePageVideo, MaybeVideo, VideoMemorySubsetEnd } from 'src/scripts/types';
import { DebugLogger } from '../debug/logger';

export class PageVideo implements MaybeVideo {
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

	onEvent(eventName: string, callback: (...args: any[]) => any) {
		if (this.element) {
			this.element.addEventListener(eventName, callback);
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

	setCurrentTime(skipTo: number) {
		if (this.element) {
			const CURRENT_TIME = this.element.currentTime;

			if (CURRENT_TIME < skipTo) {
				this.element.currentTime = skipTo;
			}
		}
	}

	setEndTime(endTime: VideoMemorySubsetEnd) {
		if (this.element && endTime !== 'full') {
			const END_TIME_LISTENER = () => {
				if (this.element) {
					const CURRENT_TIME = this.element.currentTime;

					if (CURRENT_TIME >= endTime) {
						this.element.removeEventListener('timeupdate', END_TIME_LISTENER);
						this.element.currentTime = this.element.duration;
					}
				}
			};

			this.element.addEventListener('timeupdate', END_TIME_LISTENER);
		}
	}
}
