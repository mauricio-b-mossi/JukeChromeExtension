// Caching url during service worker.
let url;

// Listening for changes done to url
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log(changes, namespace);
  if (changes?.url) {
    url = changes.url.newValue;
  }
});

chrome.commands.onCommand.addListener((command) => {
  console.log(command);

  if (url) {
    togglePlayOnCommand(url);
  } else {
    chrome.storage.local.get(["url"]).then((res) => {
      if (res.url) {
        url = res.url;
        togglePlayOnCommand(url);
      } else {
        // Message popup to display alert.
        console.log("No url provided!");
      }
    });
  }
});

function toggleTab(tabId, script = "scripts/toggle.js") {
  console.log("Pausing Script");
  console.log(tabId);
  console.log("Script fired");
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: [script],
  });
}

function playUrl(url) {
  // THERE ARE NO AUDIBLE TABS. Query url, if url play url. else create.
  chrome.tabs.query({ url: url }, (tabs) => {
    if (tabs.length > 0) {
      console.log("There is a tab url open");
      if (url.includes("spotify")) {
        toggleTab(tabs[0].id, "scripts/toggleSpotify.js");
      } else {
        toggleTab(tabs[0].id);
      }
    } else {
      // Else create your own tab
      chrome.tabs.create({ active: true, url: url }, (tab) => {
        console.log("Tab has been created.");
      });
    }
  });
}

function togglePlayOnCommand(url) {
  // GETTING AUDIBLE TABS
  chrome.tabs.query({ audible: true }, (tabs) => {
    console.log("Audible Tabs")
    console.log(tabs);

    // THERE EXIST AUDIBLE TABS
    if (tabs.length > 0) {

      // IF CURRENT TAB IS NOT MUSIC TAB
      if (tabs[0].url != url) {

        // STORE CURRENT TAB
        chrome.storage.session.set({ otherId: tabs[0].id });

        // TOGGLE NOT MUSIC
        toggleTab(tabs[0].id);

        // PLAY MUSIC
        playUrl(url);

      } else {

        // CURRENT TAB IS MUSIC TAB, get otherTab and play it.
        chrome.storage.session.get(["otherId"]).then((res) => {
          if (res.otherId) {
            console.log(res.otherId);

            // TOGGLE MUSIC
            // toggleTab(tabs[0].id);
            playUrl(url)

            // PLAY NOT MUSIC
            toggleTab(res.otherId);
          } else {

            // If no otherId stored, TOGGLE MUSIC
            // toggleTab(tabs[0].id);
            playUrl(url)
          }
        });
      }
    } else {

      // CREATE MUSIC TAB.
      playUrl(url);
    }
  });
}
