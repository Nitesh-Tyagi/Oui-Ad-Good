document.addEventListener('DOMContentLoaded', function () {
  chrome.i18n.getAcceptLanguages(function (languages) {
    const userLanguage = languages[0];
    const title = chrome.i18n.getMessage('extensionName');
    document.getElementById('title').textContent = title;
  });
});
