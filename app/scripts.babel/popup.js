(function (chrome, U, R) {
  'use strict';

  let popupInfo = null;
  let loadingInterval = setInterval(() => {
    if (popupInfo && popupInfo.tabInfo && popupInfo.tabInfo.videoId) {
      clearInterval(loadingInterval);
      loadingInterval = null;

      setUpView();
    } else if (popupInfo) { // Content script isn't registered in YouTube tab
      clearInterval(loadingInterval);
      loadingInterval = null;

      showErrorView();
    }
  }, 100);

  let videoThumbnail = null;
  let videoName = null;
  let videoId = null;
  let videoSpeed = null;
  let videoStart = null;
  let channelThumbnail = null;
  let channelName = null;
  let channelSpeed = null;
  let rememberButton = null;
  let justSetSpeedButton = null;
  let openOptions = null;

  chrome.runtime.onMessage.addListener(message => {
    switch (message.name) {
      case U.constants.RESPOND_POPUP_INFO: {
        popupInfo = message.payload;
        break;
      }
      case U.constants.CLOSE_POPUP: {
        window.close();
        break;
      }
      default: {
        console.log(`Unknown message name [${message.name}]`);
        break;
      }
    }
  });

  U.fn.runtime.requestPopupInfo();

  function updateSpeed(justSetSpeed) {
    let syncable = {
      video: {
        id: videoId.innerText,
        name: videoName.innerText,
        thumbnail: (videoThumbnail.src.endsWith(U.constants.DEFAULT_VIDEO_THUMBNAIL) ? null : videoThumbnail.src),
        speed: U.fn.util.clampSpeed(videoSpeed.value),
        startTime: U.fn.util.clampStartTime(videoStart.value)
      },
      channel: {
        name: channelName.innerText,
        thumbnail: (channelThumbnail.src.endsWith(U.constants.DEFAULT_CHANNEL_THUMBNAIL) ? null : channelThumbnail.src),
        speed: U.fn.util.clampSpeed(channelSpeed.value)
      }
    };

    // Update local view
    videoSpeed.value = syncable.video.speed;
    videoStart.value = syncable.video.startTime;
    channelSpeed.value = syncable.channel.speed;

    if (!justSetSpeed) {
      // Update shared memory
      U.fn.runtime.updateSpeedMemory(syncable);
    }

    // Update remote view
    U.fn.runtime.sendTabPlaybackInfo((popupInfo.tabId || -1), U.fn.util.resolvePlaybackSpeed(syncable.video.speed, syncable.channel.speed), syncable.video.startTime);
  }

  function updateSpeedMemory() {
    updateSpeed(false);
  }

  function justUpdateSpeed() {
    updateSpeed(true);
  }

  function showErrorView() {
    document.getElementById('error').classList.remove('hidden');
  }

  function setUpView() {
    let loader = document.getElementById('loader');

    videoThumbnail = document.getElementById('video-thumbnail');
    videoName = document.getElementById('video-name');
    videoId = document.getElementById('video-id');
    videoSpeed = document.getElementById('video-speed');
    videoStart = document.getElementById('video-start');

    channelThumbnail = document.getElementById('channel-thumbnail');
    channelName = document.getElementById('channel-name');
    channelSpeed = document.getElementById('channel-speed');

    rememberButton = document.getElementById('submit-speeds-button');
    justSetSpeedButton = document.getElementById('just-set-speeds-button');
    openOptions = document.getElementById('open-options');

    let videoThumbnailUrl = R.pathOr(null, ['tabInfo', 'videoThumbnailUrl'], popupInfo) || R.pathOr(null, ['videoMemory', 'thumbnail'], popupInfo);
    let channelThumbnailUrl = R.pathOr(null, ['tabInfo', 'channelThumbnailUrl'], popupInfo) || R.pathOr(null, ['channelMemory', 'thumbnail'], popupInfo);

    let thumbnailPromises = [];
    if (videoThumbnailUrl) {
      thumbnailPromises.push(U.fn.runtime.checkThumbnailUrl(videoThumbnailUrl, false));
    }
    if (channelThumbnailUrl) {
      thumbnailPromises.push(U.fn.runtime.checkThumbnailUrl(channelThumbnailUrl, true));
    }

    Promise.all(thumbnailPromises).then(checks => {
      checks.forEach(check => {
        if (check.result) {
          if (check.isChannel) {
            channelThumbnail.src = channelThumbnailUrl;
          } else {
            videoThumbnail.src = videoThumbnailUrl;
          }
        }
      });

      videoName.innerText = R.pathOr(null, ['tabInfo', 'videoName'], popupInfo) || R.pathOr(null, ['videoMemory', 'name'], popupInfo) || videoName.innerText;
      videoId.innerText = R.pathOr(null, ['tabInfo', 'videoId'], popupInfo) || R.pathOr(null, ['videoMemory', 'id'], popupInfo) || videoId.innerText;

      channelName.innerText = R.pathOr(null, ['tabInfo', 'channelName'], popupInfo) || R.pathOr(null, ['channelMemory', 'name'], popupInfo) || channelName.innerText;

      let tabVideoSpeed = R.pathOr(1, ['tabInfo', 'videoSpeed'], popupInfo);
      let resolvedVideoSpeed = R.pathOr(tabVideoSpeed, ['videoMemory', 'speed'], popupInfo);
      videoSpeed.value = resolvedVideoSpeed;

      let tabChannelSpeed = R.pathOr(1, ['tabInfo', 'channelSpeed'], popupInfo);
      let resolvedChannelSpeed = R.pathOr(tabChannelSpeed, ['channelMemory', 'speed'], popupInfo);
      channelSpeed.value = resolvedChannelSpeed;

      let resolvedStartTime = R.pathOr(0, ['videoMemory', 'startTime'], popupInfo);
      videoStart.value = resolvedStartTime;

      U.fn.runtime.sendTabPlaybackInfo((popupInfo.tabId || -1), U.fn.util.resolvePlaybackSpeed(resolvedVideoSpeed, resolvedChannelSpeed), resolvedStartTime);

      rememberButton.addEventListener('click', updateSpeedMemory);
      justSetSpeedButton.addEventListener('click', justUpdateSpeed);
      openOptions.addEventListener('click', function () { chrome.runtime.openOptionsPage(); });
      loader.classList.add('hidden');
    });
  }

})(chrome, window.youtubeSpeedMemoryUtilities, window.R);