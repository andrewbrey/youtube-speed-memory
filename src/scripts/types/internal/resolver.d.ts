import { ChannelMemory, GlobalBaseline, GlobalEnabled, PlaylistMemory, VideoMemory } from '..';

export type CurrentPlayerSpeed = number;

export interface SpeedResolverInput {
	enabled: GlobalEnabled;
	baseline: GlobalBaseline;
	current?: CurrentPlayerSpeed;
	video?: VideoMemory;
	channel?: ChannelMemory;
	playlist?: PlaylistMemory;
}
