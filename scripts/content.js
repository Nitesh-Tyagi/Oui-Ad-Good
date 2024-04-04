// let bannerContainer = null;
// let scriptEnabled = true; // Store the local script status
// let trackingCodesInjected = false; // To check if tracking codes have been injected
// let bannersAdded = false; // To check if banners have been added

// contentScript.js
var elementConditions = null;
chrome.runtime.sendMessage({action: "fetchJSON"}, function(response) {
  elementConditions = response.data;
  console.log("ElementConditions : ",elementConditions);
  checkCurrent();
});

function checkUrl(url, pattern) {
  const regex = new RegExp(pattern, 'i');
  return regex.test(url);
}

function findElement(query){
  const element = document.querySelector(query);
  if (element) {
      return element;
  }
  return null;
}

// TODO : Complete Banner
// TODO : Add CSS for each website
function createBanner(obj) {
  const container = document.createElement('div');
  container.style.id = "AddedByCE";
  return container;
}

function placeElement(toPlace, target, position) {
  if (position === 'before') {
    target.parentNode.insertBefore(toPlace, target);
  } else if (position === 'after') {
    target.parentNode.insertBefore(toPlace, target.nextSibling);
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
        var banner = createBanner(obj);
        if(banner) {
          placeElement(banner,targetElement,obj.placement)
        }
      }
      else console.log("NOT FOUND!!!");
      break;
    }
  }
}



// chrome.storage.sync.get(['enabled'], function (result) {
//   scriptEnabled = result.enabled; // Update local status from storage initially
//   if (scriptEnabled) {
//     injectTrackingCodes();
//     addImageInIframeWithConditions();
//   }
// });

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'toggleScript') {
//     scriptEnabled = request.enabled; // Update local status based on message
//     if (scriptEnabled) {
//       injectTrackingCodes();
//       addImageInIframeWithConditions();
//     } else {
//       removeBanner();
//     }
//   }
// });




// function addImageInIframeWithConditions() {
//   if (!bannersAdded) {
//     Object.entries(elementConditions).forEach(([conditionName, condition]) => {
//       const element = document.querySelector(condition.selector);

//       if (element && scriptEnabled) {
//         const containerDiv = createContainerDiv();

//         condition.iframeSrc.forEach(src => {
//           const iframeElement = createIframe(src.src); // Create an iframe for each source
//           containerDiv.appendChild(iframeElement); // Append each iframe to the container

//           const ctaButton = createCTAButton(src.ctaUrl); // Create a "Learn More" button
//           containerDiv.appendChild(ctaButton); // Append the button after each iframe
//         });

//         // Placement
//         if (condition.placement === 'before') {
//           element.parentNode.insertBefore(containerDiv, element);
//         } else {
//           element.parentNode.insertBefore(containerDiv, element.nextSibling);
//         }

//         // Store the container div reference
//         bannerContainer = containerDiv;
//       }
//     });
//     bannersAdded = true; // Mark banners as added
//   }
// }

// function createContainerDiv() {
//   const containerDiv = document.createElement('div');
//   containerDiv.style.display = 'flex';
//   containerDiv.style.flexDirection = 'column';
//   containerDiv.style.alignItems = 'center';
//   return containerDiv;
// }

// function createIframe(src) {
//   const iframeElement = document.createElement('iframe');
//   iframeElement.style.width = '100%';
//   iframeElement.style.height = '380px';
//   iframeElement.frameBorder = '0';
//   iframeElement.scrolling = 'no';
//   iframeElement.style.margin = '10px';
//   iframeElement.allowTransparency = 'true';
//   iframeElement.style.border = 'none';
//   iframeElement.src = src;
//   return iframeElement;
// }

// function createCTAButton(ctaUrl) {
//   const ctaButtonContainer = document.createElement('div');
//   ctaButtonContainer.style.width = '100%';
//   const ctaButton = document.createElement('button');
//   ctaButton.textContent = 'Learn More';
//   ctaButton.style.backgroundColor = '#ffffff';
//   ctaButton.style.color = 'black';
//   ctaButton.style.border = 'none';
//   ctaButton.style.padding = '10px 20px';
//   ctaButton.style.fontWeight = 'bold';
//   ctaButton.style.borderRadius = '5px';
//   ctaButton.style.cursor = 'pointer';
//   ctaButton.addEventListener('click', () => window.open(ctaUrl, '_blank'));
//   ctaButtonContainer.appendChild(ctaButton);
//   return ctaButtonContainer;
// }

// function removeBanner() {
//   if (bannerContainer && bannerContainer.parentNode) {
//     bannerContainer.parentNode.removeChild(bannerContainer);
//     bannerContainer = null;
//     bannersAdded = false; // Reset banner addition flag
//   }
// }

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