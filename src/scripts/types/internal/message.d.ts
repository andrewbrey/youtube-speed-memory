import { CurrentPlayerSpeed, VideoMemorySubsetEnd } from '..';

export interface MessageAndPayload {
	msgName: string;
	msgPayload?: any;
}

export interface ActiveTabMetadata {
	current?: CurrentPlayerSpeed;
	videoId?: string;
	channelId?: string;
	playlistId?: string;
}

export interface SpeedAndSubset {
	speed: number;
	start: number;
	end: VideoMemorySubsetEnd;
}
