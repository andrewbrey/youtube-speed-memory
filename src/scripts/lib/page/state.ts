import { DEBUG_ENABLED, VIDEO_SELECTOR } from './page.constants';

export class PageState {
	constructor() {
		if (DEBUG_ENABLED) {
			setInterval(() => {
				console.log(`video speed -> [${this.currentPlayerSpeed() || '---'}]`);
			}, 2000);
		}
	}

	currentPlayerSpeed() {
		const VIDEO = document.querySelector(VIDEO_SELECTOR);

		return VIDEO ? VIDEO.playbackRate : undefined;
	}

	videoId() {
		return this.urlQuery().get('v') || '';
	}

	channelId() {
		// TODO implement channelID lookup in DOM
		return '';
	}

	playlistId() {
		return this.urlQuery().get('list') || '';
	}

	private urlQuery() {
		const CURRENT_URL = new URL(window.location.href);

		return new URLSearchParams(CURRENT_URL.search);
	}
}
