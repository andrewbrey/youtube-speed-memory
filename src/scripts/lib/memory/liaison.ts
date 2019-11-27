import { MEMORY_SEED } from '@global/env';
import { cloneDeep, merge } from 'lodash';
import { GlobalMemory } from 'src/scripts/types';
import { browser } from 'webextension-polyfill-ts';
import { DebugLogger } from '../debug/logger';
import { GLOBAL_MEMORY_PERSISTENCE_KEY } from './memory.constants';

class MemoryLiaison {
	private logger: DebugLogger = DebugLogger.for(this.constructor.name);
	private memory: GlobalMemory = cloneDeep(MEMORY_SEED);

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

		this.memory = merge(this.memory, EXISTING_MEMORY);

		this.logger.log('current speed memory', this.memory);

		await this.saveMemory();
	}

	private async saveMemory() {
		await browser.storage.local.set({ [GLOBAL_MEMORY_PERSISTENCE_KEY]: this.memory });
	}
}

export const EventualMemoryLiaison = MemoryLiaison.init();
