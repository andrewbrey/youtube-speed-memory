(function (chrome) {
  'use strict';

  const C = {
    SET_TAB_PLAYBACK_INFO: 'SET_TAB_PLAYBACK_INFO',
    REQUEST_TAB_INFO: 'REQUEST_TAB_INFO',
    REQUEST_PLAYBACK_INFO: 'REQUEST_PLAYBACK_INFO',
    VIDEO_THUMBNAIL_TEMPLATE: 'https://img.youtube.com/vi/<<VIDEO_ID>>/mqdefault.jpg'
  };

  chrome.runtime.onMessage.addListener((message, sender, callback) => {
    handleMessage(message, callback);
    return true;
  });

  getTabInfo((result) => {
    chrome.runtime.sendMessage({name: C.REQUEST_PLAYBACK_INFO, payload: result});
  });

  function handleMessage(message, callback) {
    switch (message.name) {
      case C.REQUEST_TAB_INFO: {
        getTabInfo(callback);
        break;
      }
      case C.SET_TAB_PLAYBACK_INFO: {
        setTabPlaybackInfo(message.payload, callback);
        break;
      }
      default: {
        callback({error: `Unknown message name [${message.name}]`});
        break;
      }
    }
  }

  function setTabPlaybackInfo(playbackInfo, callback) {
    let video = null;

    try {
      video = document.querySelector('video');

      video.playbackRate = (playbackInfo.speed || 1);
      if((video.currentTime + 1) < (playbackInfo.start || 0)) {
        video.currentTime = (playbackInfo.start || 0);
      }
    } catch(e) {
      console.error('Unable to retrieve Tab info for YouTube Speed Memory');
    }

    if(callback && typeof callback === 'function') {
      callback(true);
    }
  }

  function getTabInfo(callback) {
    let videoInformationIntervalCounter = 0;
    let videoInformationInterval = setInterval(() => {
      let video = null;

      let videoId = null;
      let videoSpeed = null;
      let videoName = null;
      let videoThumbnailUrl = null;
      let channelName = null;
      let channelThumbnailUrl = null;

      try {
        video = document.querySelector('video');

        videoId = (new URL(window.location.href)).searchParams.get('v');
        videoSpeed = video.playbackRate;
        videoName = document.querySelector('#info-contents .title').innerText;
        videoThumbnailUrl = C.VIDEO_THUMBNAIL_TEMPLATE.replace('<<VIDEO_ID>>', videoId);
        channelName = document.querySelector('#owner-name a').innerText;
        channelThumbnailUrl = document.querySelector('#avatar img').src;
      } catch(e) {
        console.error('Unable to retrieve Tab info for YouTube Speed Memory');
      }

      if(videoInformationIntervalCounter > 20 || (videoId && videoSpeed && videoName && videoThumbnailUrl && channelName && channelThumbnailUrl)) {
        clearInterval(videoInformationInterval);

        if(callback && typeof callback === 'function') {
          callback({
            videoId: videoId,
            videoName: videoName,
            videoThumbnailUrl: videoThumbnailUrl,
            channelName: channelName,
            channelThumbnailUrl: channelThumbnailUrl,
            videoSpeed: videoSpeed
          });
        }
      } else {
        videoInformationIntervalCounter++;
      }
    }, 100);
  }

})(chrome);
