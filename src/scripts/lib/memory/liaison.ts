import { cloneDeep } from 'lodash';
import { GlobalMemory } from 'src/scripts/types';
import { browser } from 'webextension-polyfill-ts';
import { DebugLogger } from '../debug/logger';
import { DEFAULT_GLOBAL_MEMORY, GLOBAL_MEMORY_PERSISTENCE_KEY } from './memory.constants';

class MemoryLiaison {
	private logger: DebugLogger = DebugLogger.for(this.constructor.name);
	private memory: GlobalMemory = cloneDeep(DEFAULT_GLOBAL_MEMORY);

	static async init() {
		const LIAISON = new MemoryLiaison();

		await LIAISON.preparePersistence();

		return LIAISON;
	}

	getEnabled() {
		return this.memory.enabled;
	}

	disable() {
		this.memory.enabled = false;
		this.saveMemory();
	}

	enable() {
		this.memory.enabled = true;
		this.saveMemory();
	}

	getBaseline() {
		return this.memory.baseline;
	}

	getVideoMemory(videoId: string) {
		return this.memory.video[videoId];
	}

	getChannelMemory(channelId: string) {
		return this.memory.channel[channelId];
	}

	getPlaylistMemory(playlistId: string) {
		return this.memory.playlist[playlistId];
	}

	private async preparePersistence() {
		const { [GLOBAL_MEMORY_PERSISTENCE_KEY]: EXISTING_MEMORY } = await browser.storage.local.get({
			[GLOBAL_MEMORY_PERSISTENCE_KEY]: this.memory,
		});

		// COMMENT: Should this be a merge and not an assignment?
		this.memory = EXISTING_MEMORY;
		// this.memory = looperGlobalMemory();
		this.logger.log({ msg: 'current speed memory', what: this.memory });

		await this.saveMemory();
	}

	private async saveMemory() {
		await browser.storage.local.set({ [GLOBAL_MEMORY_PERSISTENCE_KEY]: this.memory });
	}
}

export const EventualMemoryLiaison = MemoryLiaison.init();

// TODO remove this
function looperGlobalMemory(): GlobalMemory {
	return {
		enabled: true,
		baseline: 1,
		video: {
			'155ZG0FMHxQ': {
				id: '155ZG0FMHxQ',
				speed: 1.3,
				title: 'Jesse McCartney - Wasted (Official Video)',
				image:
					'https://i.ytimg.com/vi/155ZG0FMHxQ/hqdefault.jpg?sqp=-oaymwEYCKgBEF5IVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLD7JZmHKOTCOCAvHrVZF7GM-GuDIA',
				start: 5,
				end: 183,
			},
			'4SU8gxrhs1g': {
				id: '4SU8gxrhs1g',
				speed: 1.7,
				title: 'Ben Rector - Old Friends (Official Video)',
				image:
					'https://i.ytimg.com/vi/4SU8gxrhs1g/hqdefault.jpg?sqp=-oaymwEYCKgBEF5IVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLAfdZ8Tq9cwR1JxxjouSA97xnlzFA',
				start: 19,
				end: 235,
			},
		},
		playlist: {
			'PLNfk_n98B81_LR_mahhT3sOdjCgc-1cuw': {
				id: 'PLNfk_n98B81_LR_mahhT3sOdjCgc-1cuw',
				speed: 1.1,
				title: 'Looper',
			},
		},
		channel: {
			UCvud0mK7irJ34RVdTPSwDfQ: {
				id: 'UCvud0mK7irJ34RVdTPSwDfQ',
				speed: 2,
				title: 'Quinn XCII',
				image: 'https://yt3.ggpht.com/a-/AAuE7mDGD7myTMr3OOZbY3fpi6bonAKfnIgCg7bupPoDZQ=s48-c-k-c0xffffffff-no-nd-rj',
			},
			UC0A2GKK4UdxtQTxpXYduHUg: {
				id: 'UC0A2GKK4UdxtQTxpXYduHUg',
				speed: 2,
				title: 'Quinn XCII',
				image: 'https://yt3.ggpht.com/a-/AAuE7mDGD7myTMr3OOZbY3fpi6bonAKfnIgCg7bupPoDZQ=s48-c-k-c0xffffffff-no-nd-rj',
			},
			'UCq3Ci-h945sbEYXpVlw7rJg': {
				id: 'UCq3Ci-h945sbEYXpVlw7rJg',
				speed: 1.25,
				title: 'The Chainsmokers',
				image: 'https://yt3.ggpht.com/a-/AAuE7mBObOXHE8X5QtM1pXX-4GR0GaMMF6tJb6i4C8QYeg=s48-c-k-c0xffffffff-no-nd-rj',
			},
			'UCQgUHOPJJrmzCjExg-ISupA': {
				id: 'UCQgUHOPJJrmzCjExg-ISupA',
				speed: 1.25,
				title: 'The Chainsmokers',
				image: 'https://yt3.ggpht.com/a-/AAuE7mBObOXHE8X5QtM1pXX-4GR0GaMMF6tJb6i4C8QYeg=s48-c-k-c0xffffffff-no-nd-rj',
			},
		},
	};
}
