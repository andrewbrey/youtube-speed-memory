(function (chrome, U, R, M) { // eslint-disable-line no-unused-vars
  'use strict';

  U.fn.runtime.getSpeedMemory().then(speedMemory => {
    let videoMemoryItems = document.getElementById('video-memory-items');
    let channelMemoryItems = document.getElementById('channel-memory-items');

    let videoPagerLeft = document.getElementById('video-pager-left');
    let videoPagerRight = document.getElementById('video-pager-right');
    let videoPageSize = U.constants.OPTIONS_PAGE.VIDEOS_PAGE_SIZE;
    let videoPageOffset = 0;

    let channelPagerLeft = document.getElementById('channel-pager-left');
    let channelPagerRight = document.getElementById('channel-pager-right');
    let channelPageSize = U.constants.OPTIONS_PAGE.CHANNELS_PAGE_SIZE;
    let channelPageOffset = 0;

    updateVideosSection();
    updateChannelsSection();

    function updateVideosSection() {
      videoMemoryItems.innerHTML = '';

      R.slice(videoPageOffset, videoPageSize + videoPageOffset, R.keys(speedMemory.videos)).forEach(videoKey => {
        videoMemoryItems.innerHTML += makeVideoCard(speedMemory.videos[videoKey]);
      });

      updateVideoPager();
      setupVideoForgetListeners();
    }

    function updateChannelsSection() {
      channelMemoryItems.innerHTML = '';

      R.slice(channelPageOffset, channelPageSize + channelPageOffset, R.keys(speedMemory.channels)).forEach(channelKey => {
        channelMemoryItems.innerHTML += makeChannelCard(speedMemory.channels[channelKey]);
      });

      updateChannelPager();
      setupChannelForgetListeners();
    }

    function makeVideoCard(video) {
      return `<div class="col s12 m6 l6">
                <div class="card medium">
                  <div class="card-image">
                    <img src="${video.thumbnail}">
                  </div>
                  <div class="card-content left-align">
                    <p class="break-word"><b>Video Name: </b><a href="https://www.youtube.com/watch?v=${video.id}">${video.name}</a></p>
                    <p class="break-word"><b>Video ID: </b>${video.id}</p>
                    <p><b>Speed Memory: </b>${video.speed}</p>
                    <p><b>Start Time: </b>${video.startTime}</p>
                  </div>
                  <div class="card-action center">
                    <button class="btn red video-delete-button" data-video-id="${video.id}">Forget</button>
                  </div>
                </div>
              </div>`;
    }

    function makeChannelCard(channel) {
      return `<div class="col s12 m6 l6">
                <div class="card center">
                  <div class="card-content">
                    <div class="center">
                        <img class="circle responsive-img" src="${channel.thumbnail}">
                    </div>
                    <p class="break-word"><b>Channel Name: </b>${channel.name}</p>
                    <p><b>Speed Memory: </b>${channel.speed}</p>
                  </div>
                  <div class="card-action center">
                    <button class="btn red channel-delete-button" data-channel-name="${channel.name}">Forget</button>
                  </div>
                </div>
              </div>`;
    }

    function updateVideoPager() {
      if (videoPageOffset > 0) {
        videoPagerLeft.className = 'waves-effect';
      } else {
        videoPagerLeft.className = 'disabled';
      }

      if ((videoPageOffset * videoPageSize) < (R.keys(speedMemory.videos).length - videoPageSize)) {
        videoPagerRight.className = 'waves-effect';
      } else {
        videoPagerRight.className = 'disabled';
      }
    }

    function updateChannelPager() {
      if (channelPageOffset > 0) {
        channelPagerLeft.className = 'waves-effect';
      } else {
        channelPagerLeft.className = 'disabled';
      }

      if ((channelPageOffset * channelPageSize) < (R.keys(speedMemory.channels).length - channelPageSize)) {
        channelPagerRight.className = 'waves-effect';
      } else {
        channelPagerRight.className = 'disabled';
      }
    }

    function setupVideoForgetListeners() {
      [].forEach.call(document.querySelectorAll('.video-delete-button'), btn => {
        btn.addEventListener('click', () => {
          let videoId = btn.dataset.videoId;

          delete speedMemory.videos[videoId];
          videoPageOffset = Math.max(0, videoPageOffset - 1);
          updateVideosSection();
          U.fn.runtime.deleteFromMemory(videoId, false);
        });
      });
    }

    function setupChannelForgetListeners() {
      [].forEach.call(document.querySelectorAll('.channel-delete-button'), btn => {
        btn.addEventListener('click', () => {
          let channelName = btn.dataset.channelName;

          delete speedMemory.channels[channelName];
          channelPageOffset = Math.max(0, channelPageOffset - 1);
          updateChannelsSection();
          U.fn.runtime.deleteFromMemory(channelName, true);
        });
      });
    }

    videoPagerLeft.addEventListener('click', () => {
      if (!videoPagerLeft.classList.contains('disabled')) {
        videoPageOffset = Math.max(0, videoPageOffset - videoPageSize);
        updateVideosSection();
      }
    });

    videoPagerRight.addEventListener('click', () => {
      if (!videoPagerRight.classList.contains('disabled')) {
        videoPageOffset = Math.min(R.keys(speedMemory.videos).length, videoPageOffset + videoPageSize);
        updateVideosSection();
      }
    });

    channelPagerLeft.addEventListener('click', () => {
      if (!channelPagerLeft.classList.contains('disabled')) {
        channelPageOffset = Math.max(0, channelPageOffset - channelPageSize);
        updateChannelsSection();
      }
    });

    channelPagerRight.addEventListener('click', () => {
      if (!channelPagerRight.classList.contains('disabled')) {
        channelPageOffset = Math.min(R.keys(speedMemory.channels).length, channelPageOffset + channelPageSize);
        updateChannelsSection();
      }
    });
  });

})(chrome, window.youtubeSpeedMemoryUtilities, window.R, window.M);