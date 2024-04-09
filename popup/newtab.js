const NEW_TAB_URL = 'https://ouiadgood.com/tab/'
try {
  chrome.tabs.getCurrent((tab) => {
    chrome.tabs.update(tab.id, { url: NEW_TAB_URL })
  })
} catch (e) {
  // Fall back to client-side navigation.
  document.location.href = NEW_TAB_URL
}

// document.addEventListener('DOMContentLoaded', function () {
//   chrome.i18n.getAcceptLanguages(function (languages) {
//     const userLanguage = languages[0];
//     const title = chrome.i18n.getMessage('extensionName');
//     document.getElementById('title').textContent = title;
//     console.log("OUI AD GOOD!!!");
//   });
// });
