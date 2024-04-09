document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleButton');
    const statusText = document.getElementById('statusText');
   
    // Get the current status from storage
    chrome.storage.sync.get(['enabled'], function (result) {
      toggleButton.checked = result.enabled;
      updateStatusText(result.enabled);
    });
  
    // Toggle the script status when the slider is clicked
    toggleButton.addEventListener('change', function () {
      const enabled = toggleButton.checked;
      chrome.storage.sync.set({ enabled: enabled });
      updateStatusText(enabled);
  
      // Send a message to the content script to enable/disable the script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleScript', enabled: enabled });
      });
    });
  
    function updateStatusText(enabled) {
      // Use chrome.i18n.getMessage to get localized strings
      const statusTextKey = enabled ? 'enabledStatus' : 'disabledStatus';
      const socialForGoodText = chrome.i18n.getMessage('socialForGood');
      
      statusText.textContent = `${socialForGoodText} ${chrome.i18n.getMessage(statusTextKey)}`;
    }
  });
  