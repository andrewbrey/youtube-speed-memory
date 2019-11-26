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
	onEvent(eventName: string, callback: (...args: any[]) => any): void;
	getPlaybackRate(): number;
	setPlaybackRate(rate: number): void;
	setCurrentTime(skipTo: number): void;
	setEndTime(endTime: VideoMemorySubsetEnd): void;
}

export type MaybePageVideo = HTMLVideoElement | null;
