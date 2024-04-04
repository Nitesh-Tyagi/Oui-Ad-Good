// https://developer.chrome.com/extensions/runtime#event-onInstalled
chrome.runtime.onInstalled.addListener(function (object) {
    try {
      // On install, open a welcome tab.
      if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        const postInstallURL = 'https://ouiadgood.com/tab/'
        chrome.tabs.create({ url: postInstallURL })
      }
    } catch (e) {
      console.error(e)
    }
  })
  
  // https://developer.chrome.com/docs/extensions/reference/action/#event-onClicked
  chrome.action.onClicked.addListener(function (tab) {
    try {
    //   const urlToOpen = 'https://ouiadgood.com/tab/';
    //   chrome.tabs.create({ url: urlToOpen });
      chrome.tabs.create({})
    } catch (e) {
      console.error(e)
    }
  })
  
  // On uninstall, open a post-uninstall page to get feedback.
  // https://developer.chrome.com/extensions/runtime#method-setUninstallURL
  try {
    const postUninstallURL = 'https://docs.google.com/forms/d/e/1FAIpQLScKUERhZTs9a1z0Tuz4JZg5cXZ2ULLgRdhd17JJT2XCuGL6jA/viewform'
    chrome.runtime.setUninstallURL(postUninstallURL)
  } catch (e) {
    console.error(e)
  }

// background.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "fetchJSON") {
      fetch(chrome.runtime.getURL('../source.json'))
        .then(response => response.json())
        .then(data => sendResponse({data: data}))
        .catch(error => console.error('Error loading the JSON data:', error));
      return true; // Keep the message channel open for the response
    }
  }
);
