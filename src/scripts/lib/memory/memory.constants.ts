import { GlobalMemory } from 'src/scripts/types';

export const GLOBAL_MEMORY_PERSISTENCE_KEY = 'PERSISTENCE:GLOBAL_MEMORY';

export const DEFAULT_GLOBAL_MEMORY: GlobalMemory = {
	enabled: true,
	baseline: 1,
	video: {},
	playlist: {},
	channel: {},
};
