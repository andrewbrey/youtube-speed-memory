(function (window, chrome) {
  'use strict';

  const U = {
    constants: {
      SYNC_STORAGE_KEY: 'YTSM',
      SET_TAB_PLAYBACK_INFO: 'SET_TAB_PLAYBACK_INFO',
      REQUEST_TAB_INFO: 'REQUEST_TAB_INFO',
      REQUEST_POPUP_INFO: 'REQUEST_POPUP_INFO',
      RESPOND_POPUP_INFO: 'RESPOND_POPUP_INFO',
      CLOSE_POPUP: 'CLOSE_POPUP',
      REQUEST_PLAYBACK_INFO: 'REQUEST_PLAYBACK_INFO',
      DEFAULT_PLAYBACK_SPEED: 1, // Could come from options
      DEFAULT_START_TIME: 0,
      DEFAULT_VIDEO_THUMBNAIL: 'images/video-thumbnail-placeholder.png',
      DEFAULT_CHANNEL_THUMBNAIL: 'images/channel-thumbnail-placeholder.png'
    },
    fn: {
      runtime: {
        sendRuntimeMessage: sendRuntimeMessage,
        getSpeedMemory: getSpeedMemory,
        updateSpeedMemory: updateSpeedMemory,
        checkThumbnailUrl: checkThumbnailUrl,
        sendTabPlaybackInfo: sendTabPlaybackInfo,
        requestTabInfo: requestTabInfo,
        requestPopupInfo: requestPopupInfo,
      },
      util: {
        clampSpeed: clampSpeed,
        clampStartTime: clampStartTime,
        resolvePlaybackSpeed: resolvePlaybackSpeed,
        convertToNumber: convertToNumber,
        parseHtml: parseHtml
      }
    }
  };

  window.youtubeSpeedMemoryUtilities = U;

  /*
  * RUNTIME
  * */

  function sendRuntimeMessage(messageName, messagePayload, callback) {
    chrome.runtime.sendMessage({name: messageName, payload: messagePayload}, callback);
    return true; // Ensure port stays open
  }

  function getSpeedMemory() {
    const DEFAULT_SYNC_STORAGE = _defaultSyncStorage();

    return new Promise(resolve => {
      chrome.storage.sync.get({[U.constants.SYNC_STORAGE_KEY]: DEFAULT_SYNC_STORAGE}, (items) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          resolve(DEFAULT_SYNC_STORAGE);
        } else {
          resolve(items[U.constants.SYNC_STORAGE_KEY]);
        }
      });
    });
  }

  function updateSpeedMemory(syncable) {
    getSpeedMemory().then(sm => {
      if(syncable && syncable.video) {
        let video = (sm.videos[syncable.video.id] || {});

        if(video.id) {
          video.name = (syncable.video.name || video.name || 'UNKNOWN NAME');
          video.thumbnail = (syncable.video.thumbnail || video.thumbnail || null);
          video.speed = (clampSpeed(syncable.video.speed) || clampSpeed(video.speed) || U.constants.DEFAULT_PLAYBACK_SPEED);
          video.startTime = (clampStartTime(syncable.video.startTime) || clampStartTime(video.startTime) || U.constants.DEFAULT_START_TIME);
        } else {
          video.id = (syncable.video.id || `_${(new Date()).getTime()}`);
          video.name = (syncable.video.name || 'UNKNOWN NAME');
          video.thumbnail = (syncable.video.thumbnail || null);
          video.speed = (clampSpeed(syncable.video.speed) || U.constants.DEFAULT_PLAYBACK_SPEED);
          video.startTime = (clampStartTime(syncable.video.startTime) || U.constants.DEFAULT_START_TIME);
        }

        sm.videos[video.id] = video;
      }

      if(syncable && syncable.channel) {
        let channel = (sm.channels[syncable.channel.name] || {});

        if(channel.name) {
          channel.thumbnail = (syncable.channel.thumbnail || channel.thumbnail || null);
          channel.speed = (clampSpeed(syncable.channel.speed) || clampSpeed(channel.speed) || U.constants.DEFAULT_PLAYBACK_SPEED);
        } else {
          channel.name = (syncable.channel.name || 'UNKNOWN NAME');
          channel.thumbnail = (syncable.channel.thumbnail || null);
          channel.speed = (clampSpeed(syncable.channel.speed) || U.constants.DEFAULT_PLAYBACK_SPEED);
        }

        sm.channels[channel.name] = channel;
      }

      chrome.storage.sync.set({[U.constants.SYNC_STORAGE_KEY]: sm});
    });
  }

  function sendTabPlaybackInfo(tabId, speed, startTime) {
    startTime = (startTime || 0);

    chrome.tabs.sendMessage(tabId, {
      name: U.constants.SET_TAB_PLAYBACK_INFO,
      payload: {speed: speed, start: startTime}
    });
  }

  function requestTabInfo(tabId) {
    return new Promise(resolve => {
      chrome.tabs.sendMessage(tabId, {name: U.constants.REQUEST_TAB_INFO, payload: null}, tabData => {
        resolve(tabData);
      });
    });
  }

  function requestPopupInfo() {
    sendRuntimeMessage(U.constants.REQUEST_POPUP_INFO);
  }

  function checkThumbnailUrl(thumbnailUrl, isChannel) {
    return new Promise(resolve => {
      let image = document.createElement('img');

      image.onload = () => {
        image.onload = null;
        if (image.naturalWidth === 120 && image.naturalHeight === 90 && !isChannel) { // Handle Google's default
          resolve({result: false, isChannel: !!isChannel});
        } else {
          resolve({result: true, isChannel: !!isChannel});
        }
      };

      image.onerror = () => {
        image.onerror = null;
        resolve({result: false, isChannel: !!isChannel});
      };

      image.src = thumbnailUrl;
    });
  }

  /*
  * UTIL
  * */

  function clampSpeed(speed) {
    return _clamp(speed, 1, 4);
  }

  function clampStartTime(startTime) {
    return _clamp(startTime, 0, 600);
  }

  function resolvePlaybackSpeed(videoSpeed, channelSpeed) {
    let speed = U.constants.DEFAULT_PLAYBACK_SPEED;

    videoSpeed = clampSpeed(videoSpeed);
    channelSpeed = clampSpeed(channelSpeed);

    if(videoSpeed !== U.constants.DEFAULT_PLAYBACK_SPEED || channelSpeed !== U.constants.DEFAULT_PLAYBACK_SPEED) {
      if(videoSpeed === U.constants.DEFAULT_PLAYBACK_SPEED) {
        speed = channelSpeed;
      } else if(channelSpeed === U.constants.DEFAULT_PLAYBACK_SPEED) {
        speed = videoSpeed;
      } else {
        speed = videoSpeed;
      }
    }

    return speed;
  }

  function convertToNumber(numberish) {
    // Convert to something like a number with + then
    // use boolean logic and more hacks to coerce into
    // a float with up to 2 places. Rounding may be off.
    return +((+numberish) || 0).toFixed(2);
  }

  function parseHtml(html) {
    let tempDocument = document.implementation.createHTMLDocument();
    tempDocument.body.innerHTML = html;
    return Array.from(tempDocument.body.children);
  }

  /*
  * PRIVATE
  * */

  function _defaultSyncStorage() {
    return {
      videos: {},
      channels: {}
    };
  }

  function _clamp(toClamp, min, max) {
    return Math.min(Math.max(convertToNumber(toClamp), min), max);
  }

})(window, chrome);