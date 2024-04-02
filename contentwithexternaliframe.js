// Configuration for different websites
const websiteConfigs = {
  'facebook.com': {
    selector: 'div[aria-label="Create a post"]',
    placement: 'after',
    class: 'facebook-iframe',
  },
  'twitter.com': {
    selector: 'div[aria-label="Timeline: Your Home Timeline"]',
    placement: 'before',
    class: 'twitter-iframe',
  },
  'linkedin.com': { // Ensure domain names are lowercase
    selector: 'div.share-box-feed-entry__closed-share-box.artdeco-card',
    placement: 'after',
    class: 'linkedin-iframe',

  },
  'ulta.com': { // Use domain names for consistency
    selector: '.GlobalMessagingBar',
    placement: 'before',
    class: 'ulta-iframe',
  },
  'macys.com': { // Assuming Macy's domain is 'macys.com'
    selector: '#bd',
    placement: 'before',
    class: 'macys-iframe',
  },
};

function injectIframeForSite() {
  const currentHost = window.location.host;
  let matchedConfig;
  
  // Find a configuration that matches the current host
  Object.keys(websiteConfigs).forEach((host) => {
    if (currentHost.endsWith(host)) {
      matchedConfig = websiteConfigs[host];
    }
  });

  if (!matchedConfig) return;

  const targetElement = document.querySelector(matchedConfig.selector);
  if (!targetElement) return;

  const iframeSrc = `https://ouiadgood.com/browserextension/iframe-insert.html?class=${encodeURIComponent(matchedConfig.class)}`;
  const iframe = document.createElement('iframe');
  iframe.src = iframeSrc;
  iframe.style.width = matchedConfig.width;
  iframe.style.height = matchedConfig.height;
  iframe.className = matchedConfig.class;
  iframe.style.border = 'none';

  if (matchedConfig.placement === 'before') {
    targetElement.parentNode.insertBefore(iframe, targetElement);
  } else {
    targetElement.parentNode.insertBefore(iframe, targetElement.nextSibling);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectIframeForSite);
} else {
  injectIframeForSite();
}
