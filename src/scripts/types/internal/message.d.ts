import { CurrentPlayerSpeed, PageWithState, VideoMemorySubsetEnd } from '..';

export interface MessageAndPayload {
	msgName: string;
	msgPayload?: any;
}

export type MessageHandlerMap = { [msgName: string]: GenericMessageHandler | PageMessageHandler };
export type MessageHandlerDecider = (messageName: string) => GenericMessageHandler | PageMessageHandler;
export type GenericMessageHandler = (payload?: any) => Promise<any>;
export type PageMessageHandler = (pageState: PageWithState, payload?: any) => Promise<any>;

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
