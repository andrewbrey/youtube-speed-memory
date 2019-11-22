const YSM_VIDEO = document.querySelector('video');

if (YSM_VIDEO) {
	const YSM_SPEED = 1.5;
	console.log(`Setting Speed to [${YSM_SPEED}]`);
	YSM_VIDEO.playbackRate = YSM_SPEED;
}
