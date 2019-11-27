import { PageWithState, VideoMemorySubsetEnd } from 'src/scripts/types';
import { DebugLogger } from '../debug/logger';
import { pageChangedHandler } from './handler/page-changed';
import {
	CHANNEL_LOOKUP_ID_EXTRACTOR,
	CHANNEL_LOOKUP_LINK_SELECTOR,
	CHANNEL_LOOKUP_OBSERVATION_ROOT_YT,
	CHANNEL_LOOKUP_OBSERVATION_ROOT_YTM,
	CHANNEL_LOOKUP_TIMEOUT,
	YOUTUBE_MUSIC_HOSTNAME,
} from './page.constants';
import { elementHasSizeFilter, urlQuery } from './page.utils';
import { PageVideo } from './video';

export class PageState implements PageWithState {
	private logger: DebugLogger = DebugLogger.for(this.constructor.name);
	private isYTM = location.hostname === YOUTUBE_MUSIC_HOSTNAME;
	private pageVideo = new PageVideo(this.isYTM);

	// TODO track event listeners
	constructor() {
		this.pageVideo.onEvent('play', () => {
			pageChangedHandler(this);
		});
	}

	async currentPlayerSpeed() {
		return this.pageVideo.getPlaybackRate();
	}

	async setPlayerSpeed(rate: number) {
		this.pageVideo.setPlaybackRate(rate);
	}

	async skipToTime(start: number) {
		this.pageVideo.setCurrentTime(start);
	}

	async setEndTime(end: VideoMemorySubsetEnd) {
		this.pageVideo.setEndTime(end);
	}

	async videoId() {
		return urlQuery().get('v') || '';
	}

	// IDEA: should this just watch the document instead of some other root?
	async channelId() {
		return await new Promise<string>(resolve => {
			try {
				this.logger.debug('searching for channel id');

				let foundChannelId = false;

				const LOOKUP_ROOT = this.isYTM ? CHANNEL_LOOKUP_OBSERVATION_ROOT_YTM : CHANNEL_LOOKUP_OBSERVATION_ROOT_YT;
				const ELEMENTS_TO_OBSERVE = document.querySelectorAll(LOOKUP_ROOT);
				const MUTATION_OBSERVER = new MutationObserver((mutations, observer) => {
					ELEMENTS_TO_OBSERVE.forEach(e => {
						const ALL_CHANNEL_LINKS = e.querySelectorAll(CHANNEL_LOOKUP_LINK_SELECTOR);
						const VISIBLE_CHANNEL_LINKS = Array.from(ALL_CHANNEL_LINKS).filter(elementHasSizeFilter);

						this.logger.debug('visible channel links', VISIBLE_CHANNEL_LINKS);

						if (VISIBLE_CHANNEL_LINKS.length) {
							foundChannelId = true;

							observer.disconnect();

							const ANCHOR_PATH = new URL((VISIBLE_CHANNEL_LINKS[0] as HTMLAnchorElement).href).pathname;

							resolve(ANCHOR_PATH.replace(CHANNEL_LOOKUP_ID_EXTRACTOR, '') || '');
						}
					});
				});

				ELEMENTS_TO_OBSERVE.forEach(tw =>
					MUTATION_OBSERVER.observe(tw, { attributes: true, childList: true, subtree: true })
				);

				setTimeout(() => {
					MUTATION_OBSERVER.disconnect();

					if (!foundChannelId) {
						this.logger.error('using channel id search fallback');

						const LOOKUP_FALLBACK_LINKS = document.querySelectorAll(`${LOOKUP_ROOT} ${CHANNEL_LOOKUP_LINK_SELECTOR}`);
						const VISIBLE_FALLBACK_LINKS = Array.from(LOOKUP_FALLBACK_LINKS).filter(elementHasSizeFilter);

						if (VISIBLE_FALLBACK_LINKS.length) {
							const ANCHOR_PATH = new URL((VISIBLE_FALLBACK_LINKS[0] as HTMLAnchorElement).href).pathname;

							resolve(ANCHOR_PATH.replace(CHANNEL_LOOKUP_ID_EXTRACTOR, '') || '');
						} else {
							resolve('');
						}
					}
				}, CHANNEL_LOOKUP_TIMEOUT);
			} catch (error) {
				resolve('');
			}
		});
	}

	async playlistId() {
		return urlQuery().get('list') || '';
	}
}
