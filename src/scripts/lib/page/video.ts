import { DEBUG_ENABLED } from '@global/env';
import { MaybePageVideo, MaybeVideo, VideoMemorySubsetEnd } from 'src/scripts/types';
import { DebugLogger } from '../debug/logger';
import {
	VIDEO_LOOKUP_ROOT_YT,
	VIDEO_LOOKUP_ROOT_YTM,
	VIDEO_LOOKUP_SELECTOR,
	VIDEO_LOOKUP_TIMEOUT,
} from './page.constants';
import { elementHasSizeFilter } from './page.utils';

export class PageVideo implements MaybeVideo {
	private logger: DebugLogger = DebugLogger.for(this.constructor.name);
	private elementSearch: Promise<MaybePageVideo>;
	private element: MaybePageVideo = null;

	// IDEA: should this just watch the document instead of some other root?
	constructor(isYTM: boolean) {
		const VIDEO_LOOKUP_ROOT = isYTM ? VIDEO_LOOKUP_ROOT_YTM : VIDEO_LOOKUP_ROOT_YT;

		this.elementSearch = obtainPageVideo(VIDEO_LOOKUP_ROOT, VIDEO_LOOKUP_SELECTOR);

		this.elementSearch.then(maybeVideo => {
			this.element = maybeVideo;

			if (this.element && DEBUG_ENABLED) {
				this.element.addEventListener('ratechange', () => {
					this.logger.debug(`video speed changed to [${this.element ? this.element.playbackRate : '---'}]`);
				});
			}

			if (!this.element) {
				this.logger.error('no video element found on page');
			} else {
				this.logger.log('video element initialized');
			}
		});
	}

	async onEvent(eventName: string, callback: (...args: any[]) => any) {
		try {
			await this.elementSearch;

			if (this.element) {
				this.element.addEventListener(eventName, callback);
			}
		} catch (error) {
			this.logger.error('onEvent error', error);
		}
	}

	async getPlaybackRate() {
		try {
			await this.elementSearch;

			return this.element ? this.element.playbackRate : 1;
		} catch (error) {
			this.logger.error('getPlaybackRate error', error);

			return 1;
		}
	}

	async setPlaybackRate(rate: number) {
		try {
			await this.elementSearch;

			this.logger.log(`setting speed to [${rate}]`);

			if (this.element) {
				this.element.playbackRate = rate;
			}
		} catch (error) {
			this.logger.error('setPlaybackRate error', error);
		}
	}

	async setCurrentTime(skipTo: number) {
		try {
			await this.elementSearch;

			if (this.element) {
				const CURRENT_TIME = this.element.currentTime;

				if (CURRENT_TIME < skipTo) {
					this.element.currentTime = skipTo;
				}
			}
		} catch (error) {
			this.logger.error('setCurrentTime error', error);
		}
	}

	async setEndTime(endTime: VideoMemorySubsetEnd) {
		try {
			await this.elementSearch;

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
		} catch (error) {
			this.logger.error('setEndTime error', error);
		}
	}
}

async function obtainPageVideo(videoRootSelector: string = '', videoSelector: string = ''): Promise<MaybePageVideo> {
	const LOGGER = DebugLogger.for('obtainPageVideo');

	return await new Promise<MaybePageVideo>(resolve => {
		try {
			LOGGER.debug('searching for video');

			let foundVideo = false;

			const ELEMENTS_TO_OBSERVE = document.querySelectorAll(videoRootSelector);
			const MUTATION_OBSERVER = new MutationObserver((mutations, observer) => {
				ELEMENTS_TO_OBSERVE.forEach(e => {
					const ALL_VIDEOS = e.querySelectorAll(videoSelector);
					const VISIBLE_VIDEOS = Array.from(ALL_VIDEOS).filter(elementHasSizeFilter);

					LOGGER.debug('visible videos', VISIBLE_VIDEOS);

					if (VISIBLE_VIDEOS.length) {
						foundVideo = true;

						observer.disconnect();

						resolve(VISIBLE_VIDEOS[0] as HTMLVideoElement);
					}
				});
			});

			ELEMENTS_TO_OBSERVE.forEach(tw =>
				MUTATION_OBSERVER.observe(tw, { attributes: true, childList: true, subtree: true })
			);

			setTimeout(() => {
				MUTATION_OBSERVER.disconnect();

				if (!foundVideo) {
					const LOOKUP_FALLBACK_VIDEOS = document.querySelectorAll(`${videoRootSelector} ${videoSelector}`);
					const VISIBLE_FALLBACK_VIDEOS = Array.from(LOOKUP_FALLBACK_VIDEOS).filter(elementHasSizeFilter);

					LOGGER.error('using video lookup fallback');

					if (VISIBLE_FALLBACK_VIDEOS.length) {
						resolve(VISIBLE_FALLBACK_VIDEOS[0] as HTMLVideoElement);
					} else {
						resolve(null);
					}
				}
			}, VIDEO_LOOKUP_TIMEOUT);
		} catch (error) {
			resolve(null);
		}
	});
}
