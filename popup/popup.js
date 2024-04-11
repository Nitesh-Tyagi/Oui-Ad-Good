const toggleSwitch = document.getElementById('toggleSwitch');
const toggleLabel = document.getElementById('toggleLabel');

chrome.runtime.sendMessage({action: "getStatus"}, function(response) {
    toggleSwitch.checked = response.enabled;
    updateStatusText(response.enabled);
});

toggleSwitch.addEventListener('change', function () {
    const enabled = toggleSwitch.checked;

    chrome.runtime.sendMessage({action: "updateEnabledState", enabled: enabled}, function(response) {
        updateStatusText(enabled);
    });
});


function updateStatusText(enabled) {
    const statusTextKey = enabled ? 'enabledStatus' : 'disabledStatus';
    const socialForGoodText = chrome.i18n.getMessage('socialForGood');

    toggleLabel.textContent = `${socialForGoodText} ${chrome.i18n.getMessage(statusTextKey)}`;
}