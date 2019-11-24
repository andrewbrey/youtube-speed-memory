import { CurrentPlayerSpeed } from '..';

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
