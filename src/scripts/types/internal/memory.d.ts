export type GlobalEnabled = boolean;
export type GlobalBaseline = number;
export type VideoMemorySubsetEnd = number | 'full';

export interface VideoMemory {
	id: string;
	speed: number;
	title: string;
	image: string;
	start: number;
	end: VideoMemorySubsetEnd;
}

export interface ChannelMemory {
	id: string;
	speed: number;
	title: string;
	image: string;
}

export interface PlaylistMemory {
	id: string;
	speed: number;
	title: string;
}

export interface GlobalMemory {
	enabled: GlobalEnabled;
	baseline: GlobalBaseline;
	video: { [id: string]: VideoMemory };
	channel: { [id: string]: ChannelMemory };
	playlist: { [id: string]: PlaylistMemory };
}
