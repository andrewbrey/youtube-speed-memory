import { VideoMemorySubsetEnd } from '..';

export interface PageWithState {
	currentPlayerSpeed(): Promise<number>;
	setPlayerSpeed(rate: number): void;
	skipToTime(start: number): void;
	setEndTime(end: VideoMemorySubsetEnd): void;
	videoId(): Promise<string>;
	channelId(): Promise<string>;
	playlistId(): Promise<string>;
}

export interface MaybeVideo {
	onEvent(eventName: string, callback: (...args: any[]) => any): Promise<void>;
	getPlaybackRate(): Promise<number>;
	setPlaybackRate(rate: number): Promise<void>;
	setCurrentTime(skipTo: number): Promise<void>;
	setEndTime(endTime: VideoMemorySubsetEnd): Promise<void>;
}

export type MaybePageVideo = HTMLVideoElement | null;
