(function (chrome, U) {
  'use strict';

  chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({ url: '*://*.youtube.com/*' }, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.executeScript(tab.id, { file: '/scripts/youtube-speed-memory-listener.js', runAt: 'document_end' }, () => {
          chrome.pageAction.show(tab.id);
          chrome.pageAction.setTitle({ tabId: tab.id, title: 'YouTube Speed Memory' });
        });
      });
    });
  });

  chrome.runtime.onUpdateAvailable.addListener(() => {
    console.log('Update listener invoked - reloading runtime.');
    chrome.runtime.reload();
  });

  chrome.runtime.onMessage.addListener((message, sender) => {
    switch (message.name) {
      case U.constants.REQUEST_PLAYBACK_INFO: {
        U.fn.runtime.getSpeedMemory().then(speedMemory => {
          let playbackInfo = resolvePlaybackInfo(speedMemory, message.payload);
          U.fn.runtime.sendTabPlaybackInfo(sender.tab.id, playbackInfo.speed, playbackInfo.startTime);
        });
        break;
      }
      case U.constants.REQUEST_POPUP_INFO: {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          let speedMemoryPromise = U.fn.runtime.getSpeedMemory();
          let tabInfoPromise = U.fn.runtime.requestTabInfo(tabs[0].id);

          Promise.all([speedMemoryPromise, tabInfoPromise])
            .then(result => {
              let tabInfo = (result[1] || {});
              let existingVideoMemory = result[0].videos[tabInfo.videoId];
              let existingChannelMemory = result[0].channels[tabInfo.channelName];

              let popupInfo = {
                videoMemory: existingVideoMemory,
                channelMemory: existingChannelMemory,
                tabInfo: tabInfo,
                tabId: tabs[0].id
              };

              U.fn.runtime.sendRuntimeMessage(U.constants.RESPOND_POPUP_INFO, popupInfo);
            });
        });
        break;
      }
      default: {
        console.log(`Unknown message name [${message.name}]`);
        break;
      }
    }
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab && tab.url && tab.url.match(/^.+:\/\/.+youtube.com.*v=.*$/)) {
      chrome.pageAction.show(tab.id);
      chrome.pageAction.setTitle({ tabId: tab.id, title: 'YouTube Speed Memory is Active!' });

      sendSpeedUpdateToTab(tab.id, (changeInfo && changeInfo.status === 'loading'));
    } else {
      chrome.pageAction.hide(tab.id);
      chrome.pageAction.setTitle({ tabId: tab.id, title: 'YouTube Speed Memory is Inactive' });
    }
  });

  chrome.tabs.onCreated.addListener(tab => {
    if (tab && tab.url && tab.url.match(/^.+:\/\/.+youtube.com.*v=.*$/)) {
      chrome.pageAction.show(tab.id);
      chrome.pageAction.setTitle({ tabId: tab.id, title: 'YouTube Speed Memory is Active!' });

      sendSpeedUpdateToTab(tab.id);
    } else {
      chrome.pageAction.hide(tab.id);
      chrome.pageAction.setTitle({ tabId: tab.id, title: 'YouTube Speed Memory is Inactive' });
    }
  });

  chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab && tab.url && tab.url.match(/^.+:\/\/.+youtube.com.*v=.*$/)) {
        chrome.pageAction.show(tab.id);
        chrome.pageAction.setTitle({ tabId: tab.id, title: 'YouTube Speed Memory is Active!' });
      } else {
        chrome.pageAction.hide(tab.id);
        chrome.pageAction.setTitle({ tabId: tab.id, title: 'YouTube Speed Memory is Inactive' });
      }
    });
  });

  function sendSpeedUpdateToTab(tabId, shouldClosePopup) {
    if (shouldClosePopup) {
      U.fn.runtime.sendRuntimeMessage(U.constants.CLOSE_POPUP);
    }
    let speedMemoryPromise = U.fn.runtime.getSpeedMemory();
    let tabInfoPromise = U.fn.runtime.requestTabInfo(tabId);

    Promise.all([speedMemoryPromise, tabInfoPromise])
      .then(result => {
        let playbackInfo = resolvePlaybackInfo(result[0], result[1]);

        U.fn.runtime.sendTabPlaybackInfo(tabId, playbackInfo.speed, playbackInfo.startTime);
      });
  }

  function resolvePlaybackInfo(speedMemory, tabInfo) {
    tabInfo = (tabInfo || {});

    let existingVideoMemory = (speedMemory.videos[tabInfo.videoId] || {});
    let existingChannelMemory = (speedMemory.channels[tabInfo.channelName] || {});

    let speed = U.fn.util.resolvePlaybackSpeed(existingVideoMemory.speed, existingChannelMemory.speed);
    let start = 0;

    if (existingVideoMemory.startTime) {
      start = existingVideoMemory.startTime;
    }

    return {
      speed: speed,
      startTime: start
    };
  }

})(chrome, window.youtubeSpeedMemoryUtilities);
