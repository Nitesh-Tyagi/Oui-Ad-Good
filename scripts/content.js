let bannerContainer = null;
let scriptEnabled = true; // Store the local script status
let trackingCodesInjected = false; // To check if tracking codes have been injected
let bannersAdded = false; // To check if banners have been added

var elementConditions = null;

chrome.runtime.sendMessage({action: "getStatus"}, function(response) {
  scriptEnabled = response.enabled;
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'toggleScript') {
    scriptEnabled = request.enabled;
    if (scriptEnabled && elementConditions) {
      checkCurrent();
    } else {
      removeBanner();
    }
  }
});

chrome.runtime.sendMessage({action: "fetchJSON"}, function(response) {
  elementConditions = response.data;
  console.log("ElementConditions : ",elementConditions);
  console.log("FETCHED JSON, SCRIPT ENABLED ::: ",scriptEnabled);
  if(scriptEnabled) {
    checkCurrent();
  }
});

function checkUrl(url, pattern) {
  const regex = new RegExp(pattern, 'i');
  return regex.test(url);
}

function findElement(query){
  const elements = document.querySelectorAll(query);
  if (elements[0]) {
      return elements[0];
  }
  return null;
}

function createIframe(src) {
  const iframeElement = document.createElement('iframe');
  iframeElement.frameBorder = '0';
  iframeElement.scrolling = 'no';
  iframeElement.allowTransparency = 'true';
  iframeElement.classList.add('iframe');
  iframeElement.src = src;
  return iframeElement;
}

function createCTAButton(ctaUrl) {
  const ctaButtonContainer = document.createElement('div');
  ctaButtonContainer.style.width = '100%';
  const ctaButton = document.createElement('button');
  ctaButton.textContent = 'Learn More';
  ctaButton.classList.add('ctaButton');
  ctaButton.addEventListener('click', () => window.open(ctaUrl, '_blank'));
  ctaButtonContainer.appendChild(ctaButton);
  return ctaButtonContainer;
}

function prepareScript(src, callback) {
  chrome.runtime.sendMessage({
    action: "fetchScript",
    src: src
  }, function(response) {
    if (response && response.success) {
      console.log("Received script content:", response.content);
      callback(response.content);
    } else {
      console.error("Failed to fetch script content:", response.error);
    }
  });
}


function addBanner(banner,className) {
  if(banner.type=='iframeSrc') {
    if(className=='linkedin' || className=='macys' || className=='ulta' || className=='amazon'){
      const container = document.createElement('div');
      container.classList.add('container');

      if(className=='linkedin') {
        var nameSpan = document.createElement('div');
        nameSpan.classList.add('nameSpan');
        nameSpan.innerText = 'Oui Ad Good';
        container.appendChild(nameSpan);
      }

      const iframeElement = createIframe(banner.src);
      const ctaButton = createCTAButton(banner.ctaUrl);
      
      container.appendChild(iframeElement);
      container.appendChild(ctaButton);
      bannerContainer.appendChild(container);
    }
    else {
      const container = document.createElement('div');
      container.classList.add('container');

      if(className=='facebook') {
        var nameSpan = document.createElement('div');
        nameSpan.classList.add('nameSpan');
        nameSpan.innerText = 'Oui Ad Good';
        container.appendChild(nameSpan);
      }

      const iframeElement = createIframe(banner.src);
      const ctaButton = createCTAButton(banner.ctaUrl);
      container.appendChild(iframeElement);
      container.appendChild(ctaButton);
      bannerContainer.appendChild(container);
    }
  }
  else if(banner.type=='script') {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    
    const ctaButton = createCTAButton(banner.ctaUrl);
    // bannerContainer.appendChild(scriptElement);
    // bannerContainer.appendChild(ctaButton);
  }
  // else if(banner.type=='script') {
  //   console.log("PREPARING SCRIPT");
  //   prepareScript(banner.src, function(scriptContent) {
  //     console.log("Script Content Received: ", scriptContent);


  //     // const scriptElement = document.createElement('script');
  //     // scriptElement.textContent = scriptContent; // Use textContent for inline script
  //     // container.appendChild(scriptElement); // Assumes `container` is defined and accessible
  
  //     // // Optionally append the CTA button as before
  //     // const ctaButton = createCTAButton(banner.ctaUrl);
  //     // container.appendChild(ctaButton);
  //   });
  //   console.log("PREPARED SCRIPT");
  // }
  
  else if(banner.type=='html') {
    const contentUrl = banner.src;

    fetch(contentUrl)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
    
        Array.from(doc.body.childNodes).forEach(node => {
          bannerContainer.appendChild(node.cloneNode(true));
        });
      })
      .catch(error => console.error('Error fetching content:', error));
  }    
}


function createBanner(obj, className) {
  bannerContainer = document.createElement('div');
  bannerContainer.classList.add('OuiAdGood_Container');
  bannerContainer.classList.add(className);

  for (banner of obj.banners) {
    addBanner(banner, className);
  }

  console.log("CONTAINER : ",bannerContainer);
  return bannerContainer;
}

function placeElement(target, position) {
  if(bannerContainer)

  if (position === 'before') {
    target.parentNode.insertBefore(bannerContainer, target);
  } else if (position === 'after') {
    target.parentNode.insertBefore(bannerContainer, target.nextSibling);
  } else {
    console.error("Position must be 'before' or 'after'.");
  }
}

function checkCurrent() {
  var url = window.location.href;
  for (const obj of elementConditions) {
    if(checkUrl(url,obj.target)){
      console.log("MATCHED : ",obj.target);
      var targetElement = findElement(obj.selector);
      if(targetElement) {
        console.log("FOUND : ",targetElement);
        createBanner(obj,obj.target);
        if(bannerContainer) {
          placeElement(targetElement,obj.placement)
        }
      }
      else console.log("NOT FOUND!!!");
      break;
    }
  }
}



function removeBanner() {
  if (bannerContainer && bannerContainer.parentNode) {
    bannerContainer.parentNode.removeChild(bannerContainer);
    bannerContainer = null;
    bannersAdded = false; // Reset banner addition flag
  }
}

// function injectTrackingCodes() {
//   if (!trackingCodesInjected) {
//     injectFacebookPixel();
//     injectGoogleAnalytics();
//     trackingCodesInjected = true; // Mark tracking codes as injected
//   }
// }

// function injectGoogleTagManager() {
//   injectGTMHead();
//   injectGTMBody();
// }

// function injectGTMHead() {
//   if (!document.getElementById('gtmHead')) {
//     const script = document.createElement('script');
//     script.id = 'gtmHead';
//     script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//     })(window,document,'script','dataLayer','GTM-W2V9LSSZ');`;
//     document.head.appendChild(script);
//   }
// }

// function injectGTMBody() {
//   if (!document.getElementById('gtmBody')) {
//     const noscript = document.createElement('noscript');
//     noscript.id = 'gtmBody';
//     noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W2V9LSSZ"
//     height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
//     document.body.insertBefore(noscript, document.body.firstChild);
//   }
// }

// chrome.storage.sync.get(['enabled'], function (result) {
//   scriptEnabled = result.enabled;
//   if (scriptEnabled) {
//     injectTrackingCodes();
//     injectGoogleTagManager(); // Add this line to inject GTM when your script runs
//     addImageInIframeWithConditions();
//   }
// });

// // Include this call in your existing chrome.runtime.onMessage.addListener callback as well.


// function injectFacebookPixel() {
//   if (!document.getElementById('fbPixelScript')) { // Check if the FB Pixel script is already added
//     // Facebook Pixel script
//     const fbPixelScript = document.createElement('script');
//     fbPixelScript.id = 'fbPixelScript'; // Assign an ID to the script for identification
//     fbPixelScript.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '492030411555076');fbq('track', 'PageView');`;
//     document.head.appendChild(fbPixelScript);
  
//     // Facebook Pixel no-script
//     const fbPixelNoscript = document.createElement('noscript');
//     const fbPixelImg = document.createElement('img');
//     fbPixelImg.setAttribute('height', '1');
//     fbPixelImg.setAttribute('width', '1');
//     fbPixelImg.setAttribute('style', 'display:none');
//     fbPixelImg.setAttribute('src', 'https://www.facebook.com/tr?id=492030411555076&ev=PageView&noscript=1');
//     fbPixelNoscript.appendChild(fbPixelImg);
//     document.head.appendChild(fbPixelNoscript);
//   }
// }

// function injectGoogleAnalytics() {
//   if (!document.getElementById('gaScript')) { // Check if the GA script is already added
//     // Google Analytics script
//     const gaScript = document.createElement('script');
//     gaScript.id = 'gaScript'; // Assign an ID to the script for identification
//     gaScript.async = true;
//     gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-95QCLZH6ER';
//     document.head.appendChild(gaScript);

//     const gaScript2 = document.createElement('script');
//     gaScript2.textContent = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-95QCLZH6ER');`;
//     document.head.appendChild(gaScript2);
//   }
// }