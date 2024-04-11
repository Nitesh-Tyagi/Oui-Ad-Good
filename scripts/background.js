var Source = 'https://Nitesh-Tyagi.github.io/Oui_Ad_Good_Resources/source.json';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStatus") {
    chrome.storage.sync.get(['enabled'], function(result) {
      sendResponse({enabled: result.enabled});
    });
    return true;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateEnabledState") {
    chrome.storage.sync.set({enabled: request.enabled}, () => {
      console.log('Enabled state updated to:', request.enabled);
      
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { action: 'toggleScript', enabled: request.enabled });
        });
      });

      sendResponse({message: "Enabled state and content scripts updated successfully."});
    });
    return true;
  }
});
        


// https://developer.chrome.com/extensions/runtime#event-onInstalled
chrome.runtime.onInstalled.addListener(function (object) {
    try {
      chrome.storage.sync.set({enabled: true}, () => {
        console.log('The extension is installed and the enabled status is set to true.');
      });
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
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.action === "fetchJSON") {
//     chrome.storage.sync.get(["OUI_AD_GOOD_LastDate", "OUI_AD_GOOD_Source"], function(items) {
//       const lastDate = new Date(items.OUI_AD_GOOD_LastDate);
//       const currentDate = new Date();
//       const daysDiff = (currentDate - lastDate) / (1000 * 3600 * 24); // Difference in days

//       // Check if LastDate is not found or more than/equal to 15 days
//       if (!items.OUI_AD_GOOD_LastDate || daysDiff >= 15) {
//         fetch(Source)
//           .then(response => {
//             if (!response.ok) {
//               throw new Error('Network response was not ok');
//             }
//             return response.json();
//           })
//           .then(data => {
//             // Store the fetched data and current date in sync storage
//             chrome.storage.sync.set({
//               OUI_AD_GOOD_Source: data,
//               OUI_AD_GOOD_LastDate: currentDate.toISOString()
//             }, function() {
//               sendResponse({data: data});
//             });
//           })
//           .catch(error => {
//             console.error('Could not fetch the JSON:', error);
//             sendResponse({error: error.toString()});
//           });
//       } else {
//         // Less than 15 days, just return the stored value
//         sendResponse({data: items.OUI_AD_GOOD_Source});
//       }
//     });
//     return true; // Indicate async response
//   }
// });



chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action == "fetchScript") {

    try {
      const response = await fetch(request.src);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const content = await response.text();
      sendResponse({ success: true, content });
    } catch (error) {
      console.error('Fetch error:', error);
      sendResponse({ success: false, error: error.message });
    }

    return true; // Keep the message channel open for the response
  }
});

