# YouTube Speed Memory <img src="https://github.com/andrewbrey/youtube-speed-memory/blob/master/app/images/icon-150.png" width="75" align="left" />

[![GitHub release](https://img.shields.io/github/package-json/v/andrewbrey/youtube-speed-memory.svg?label=Package%20Version)](https://github.com/andrewbrey/youtube-speed-memory/releases)
[![License: MIT](https://img.shields.io/github/license/andrewbrey/youtube-speed-memory.svg?label=License)](https://github.com/andrewbrey/youtube-speed-memory/blob/master/LICENSE)
[![Web store version](https://img.shields.io/chrome-web-store/v/okeninbcaejpibjhmdehanfedmpckigj.svg?label=Chrome%20Store%20Version)](https://chrome.google.com/webstore/detail/youtube-speed-memory/okeninbcaejpibjhmdehanfedmpckigj)
[![User count](https://img.shields.io/chrome-web-store/users/okeninbcaejpibjhmdehanfedmpckigj.svg?label=Chrome%20Users)](https://chrome.google.com/webstore/detail/youtube-speed-memory/okeninbcaejpibjhmdehanfedmpckigj)
[![Firefox store version](https://img.shields.io/amo/v/youtube-speed-memory.svg?label=Firefox%20Store%20Version)](https://addons.mozilla.org/en-US/firefox/addon/youtube-speed-memory)
[![Firefox User count](https://img.shields.io/amo/users/youtube-speed-memory.svg?label=Firefox%20Users)](https://addons.mozilla.org/en-US/firefox/addon/youtube-speed-memory)
---
## Release Notes
### 1.x.x

- ***1.4.x***
  - ***1.4.7*** - Update code to work with the version of YouTube that Google is testing periodically for some users
  - ***1.4.6*** - Remove code minification from third party libraries as well
  - ***1.4.5*** - Remove code minification that is disliked by Firefox
  - ***1.4.4*** - Fix an issue with the paged content on the options page being limited prematurely
  - ***1.4.3*** - Help make sure speed updates take place when the URL changes automatically (like in a playlist)
  - ***1.4.2*** - Another quick adjustment to how the page action title behaves
  - ***1.4.1*** - Make sure the page action title is accurate
  - ***1.4.0*** - Add support for Firefox
- ***1.3.x***
  - ***1.3.3*** - Only save video speeds if they are worth saving and make sure everyone stays on the latest versions
  - ***1.3.2*** - Fix a bug that caused videos not to automatically update speed when the URL changed
  - ***1.3.1*** - Make the video titles on the options page into direct links
  - ***1.3.0*** - Update options page to list your existing video and channel speed memory settings
- ***1.2.x***
  - ***1.2.0*** - Add a "just set the speed" button that will do a one-time speed update for the current video, and not commit the speed to memory
- ***1.1.x***
  - ***1.1.0*** - Updated the app to use locally stored data rather than Chrome synchronized data. This helps ensure there's plenty of space to store lots of speed memories, but will result in having starting your speed memory list over
- ***1.0.x***
  - ***1.0.4*** - Taking another look at at the bug from the previous release after more circumstances where the wrong image could be displayed
  - ***1.0.3*** - Fixed an issue where the wrong channel image could be displayed
  - ***1.0.2*** - Fixed an issue where having multiple YouTube tabs open in different windows could cause the extension to fail
  - ***1.0.1*** - Added documentation and assets for the source code repository
  - ***1.0.0*** - An extension is born :)