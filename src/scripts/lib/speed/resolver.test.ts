import { ChannelMemory, CurrentPlayerSpeed, PlaylistMemory, SpeedResolverInput, VideoMemory } from '../../types';
import { SpeedResolver } from './resolver';

const DEFAULT_GLOBAL_BASELINE = 1;
const DEFAULT_ENABLED = true;
const DEFAULT_CURRENT_SPEED: CurrentPlayerSpeed = 1.01;

describe('SpeedResolver', () => {
	it('resolves to the current player speed when globally disabled', () => {
		const EXPECTED_SPEED = 9.5;

		const RESOLVABLE: SpeedResolverInput = {
			current: EXPECTED_SPEED,
			baseline: DEFAULT_GLOBAL_BASELINE,
			enabled: false,
			video: videoMemory(EXPECTED_SPEED),
			channel: channelMemory(),
			playlist: playlistMemory(),
		};

		expect(SpeedResolver.resolve(RESOLVABLE)).toBe(EXPECTED_SPEED);
	});

	it('resolves to 1 when globally disabled and no current speed is known', () => {
		const EXPECTED_SPEED = 1;

		const RESOLVABLE: SpeedResolverInput = {
			current: undefined,
			baseline: DEFAULT_GLOBAL_BASELINE,
			enabled: false,
			video: videoMemory(EXPECTED_SPEED),
			channel: channelMemory(),
			playlist: playlistMemory(),
		};

		expect(SpeedResolver.resolve(RESOLVABLE)).toBe(EXPECTED_SPEED);
	});

	it('resolves to the video speed when one is present', () => {
		const EXPECTED_SPEED = 2.77;

		const RESOLVABLE: SpeedResolverInput = {
			current: DEFAULT_CURRENT_SPEED,
			baseline: DEFAULT_GLOBAL_BASELINE,
			enabled: DEFAULT_ENABLED,
			video: videoMemory(EXPECTED_SPEED),
			channel: channelMemory(),
			playlist: playlistMemory(),
		};

		expect(SpeedResolver.resolve(RESOLVABLE)).toBe(EXPECTED_SPEED);
	});

	it('resolves to the channel speed when one is present and no video is present', () => {
		const EXPECTED_SPEED = 3.74;

		const RESOLVABLE: SpeedResolverInput = {
			current: DEFAULT_CURRENT_SPEED,
			baseline: DEFAULT_GLOBAL_BASELINE,
			enabled: DEFAULT_ENABLED,
			video: undefined,
			channel: channelMemory(EXPECTED_SPEED),
			playlist: playlistMemory(),
		};

		expect(SpeedResolver.resolve(RESOLVABLE)).toBe(EXPECTED_SPEED);
	});

	it('resolves to the playlist speed when one is present and no video or channel is present', () => {
		const EXPECTED_SPEED = 1.99;

		const RESOLVABLE: SpeedResolverInput = {
			current: DEFAULT_CURRENT_SPEED,
			baseline: DEFAULT_GLOBAL_BASELINE,
			enabled: DEFAULT_ENABLED,
			video: undefined,
			channel: undefined,
			playlist: playlistMemory(EXPECTED_SPEED),
		};

		expect(SpeedResolver.resolve(RESOLVABLE)).toBe(EXPECTED_SPEED);
	});

	it('resolves to the baseline speed when one is present and no video, channel, or playlist is present', () => {
		const EXPECTED_SPEED = 0.99;

		const RESOLVABLE: SpeedResolverInput = {
			current: DEFAULT_CURRENT_SPEED,
			baseline: EXPECTED_SPEED,
			enabled: DEFAULT_ENABLED,
			video: undefined,
			channel: undefined,
			playlist: undefined,
		};

		expect(SpeedResolver.resolve(RESOLVABLE)).toBe(EXPECTED_SPEED);
	});
});

function videoMemory(speedSetting: number = 1.7): VideoMemory {
	return {
		id: '4SU8gxrhs1g',
		speed: speedSetting,
		title: 'Ben Rector - Old Friends (Official Video)',
		image:
			'https://i.ytimg.com/vi/4SU8gxrhs1g/hqdefault.jpg?sqp=-oaymwEYCKgBEF5IVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLAfdZ8Tq9cwR1JxxjouSA97xnlzFA',
	};
}

function channelMemory(speedSetting: number = 2): ChannelMemory {
	return {
		id: 'UCvud0mK7irJ34RVdTPSwDfQ',
		speed: speedSetting,
		title: 'Quinn XCII',
		image: 'https://yt3.ggpht.com/a-/AAuE7mDGD7myTMr3OOZbY3fpi6bonAKfnIgCg7bupPoDZQ=s48-c-k-c0xffffffff-no-nd-rj',
	};
}

function playlistMemory(speedSetting: number = 1.1): PlaylistMemory {
	return {
		id: 'PLNfk_n98B81_LR_mahhT3sOdjCgc-1cuw',
		speed: speedSetting,
		title: 'Looper',
	};
}
