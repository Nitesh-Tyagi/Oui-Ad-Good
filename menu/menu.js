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
    toggleLabel.textContent = enabled ? 'Social Media For Good: Enabled' : 'Social Media For Good: Disabled';
}