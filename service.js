// Hardcoding just for test purp
const url = "https://www.youtube.com/watch?v=PHo7BHezqoo";

chrome.commands.onCommand.addListener((command) => {
  console.log("Command");

  // The current must be audible. If non audible, and non is url, create url.
  chrome.tabs.query({ audible: true }, (tabs) => {
    console.log(tabs.length);

    // If there are audible tabs
    if (tabs.length > 0) {
      // If current is NOT music STORE, ELSE toggle.
      if (tabs[0].url != url) {
        // Storing not music
        chrome.storage.session.set({ otherId: tabs[0].id });
        // Toggle not music
        toggleTab(tabs[0].id);
        // Play music
        playUrl(url)

      } else {
        // Getting music
        chrome.storage.session.get(["otherId"]).then((res) => {
          if (res.otherId) {
            console.log(res.otherId);
            // Toggling music.
            toggleTab(tabs[0].id);
            // Toggle not music.
            toggleTab(res.otherId);
          } else {
            // If there is no otherId stored Just toggle.
            toggleTab(tabs[0].id);
          }
        });
      }
    } else {
      playUrl(url)
    }
  });
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

function playUrl(url){
      // THERE ARE NO AUDIBLE TABS. Query url, if url play url. else create.
      chrome.tabs.query({ url: url }, (tabs) => {
        if (tabs.length > 0) {
          console.log("There is oppenheimer at tab");
          toggleTab(tabs[0].id);
        } else {
          // Else create your own tab
          chrome.tabs.create({ active: true, url: url }, (tab) => {
            console.log("Tab has been created.");
          });
        }
      });

}
