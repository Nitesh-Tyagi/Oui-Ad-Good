/* globals chrome */

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


// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Find the element with the specified aria-label attribute
  var elementWithAriaLabel = document.querySelector('[aria-label="Create a post"]');
  
  // Check if the element was found
  if (elementWithAriaLabel) {
    // Create a new div element
    var newDiv = document.createElement("div");
    
    // Add content or attributes to the new div if needed
    newDiv.textContent = "https://ouiadgood.com/tab/img/ouiadgood-logo-centered-by-OuiDoGood.3757aad4.png";
    
    // Append the new div to the found element
    elementWithAriaLabel.appendChild(newDiv);
  } else {
    console.log("Element with specified aria-label not found.");
  }
});
