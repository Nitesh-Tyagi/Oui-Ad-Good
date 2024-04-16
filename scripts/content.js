let bannerContainer = null;
let scriptEnabled = true; // Store the local script status
let trackingCodesInjected = false; // To check if tracking codes have been injected
let bannersAdded = false; // To check if banners have been added

var elementConditions = null;

chrome.runtime.sendMessage({action: "getStatus"}, function(response) {
  scriptEnabled = response.enabled;
});

// ASYNC : CHECK for SCRIPT ENABLED ( POPUP )
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

// ASYNC : LOAD SOURCE.JSON, then begin 'checkCurrent' flow
chrome.runtime.sendMessage({action: "fetchJSON"}, function(response) {
  elementConditions = response.data;
  console.log("ElementConditions : ",elementConditions);
  console.log("FETCHED JSON, SCRIPT ENABLED ::: ",scriptEnabled);
  if(scriptEnabled) {
    checkCurrent();
  }
});

// UTILITY : Match TARGET URL to TARGET website
function checkUrl(url, pattern) {
  const regex = new RegExp(pattern, 'i');
  return regex.test(url);
}

// Target the first element matching the query
// TODO : In future can consider shifting to x-path instead of querySelector
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

function createIframeHW(src, containerWidth, containerHeight) {
  const iframeElement = document.createElement('iframe');
  
  // Set the style for the iframe to fill the container
  iframeElement.style.width = `${containerWidth}px`;
  iframeElement.style.height = `${containerHeight}px`;
  iframeElement.style.backgroundColor = 'black';
  iframeElement.frameBorder = '0';
  iframeElement.scrolling = 'no';
  iframeElement.allowTransparency = 'true';
  iframeElement.style.display = 'block';
  iframeElement.style.overflow = 'hidden';
  iframeElement.style.objectFit = 'contain';

  iframeElement.onload = function() {
    const doc = iframeElement.contentDocument || iframeElement.contentWindow.document;
    
    // CSS to center the image and fill the background with black
    const css = `
      body, html { margin: 0; height: 100%; background: black; }
      img { 
        width: auto; 
        height: auto; 
        max-width: ${containerWidth}px; 
        max-height: ${containerHeight}px;
        position: absolute; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        object-fit: contain;
      }
    `;

    const style = doc.createElement('style');
    doc.head.appendChild(style);
    style.appendChild(doc.createTextNode(css));

    const img = doc.createElement('img');
    img.onload = function() {
      // Adjust the size of the iframe's contentWindow to maintain the image's aspect ratio
      const aspectRatio = img.width / img.height;
      const scaledHeight = containerWidth / aspectRatio;
      if (scaledHeight < containerHeight) {
        img.style.width = `${containerWidth}px`;
        img.style.height = 'auto';
      } else {
        img.style.width = 'auto';
        img.style.height = `${containerHeight}px`;
      }
    };
    img.src = src;
    doc.body.appendChild(img);
  };

  // Set the iframe's source to 'about:blank' to allow content manipulation
  iframeElement.src = 'about:blank';

  return iframeElement;
}

// CREATE CallToAction Button
function createCTAButton(ctaUrl) {
  const ctaButtonContainer = document.createElement('div');
  ctaButtonContainer.classList.add('ctaButtonContainer')
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

// CREATE BANNERS
// banner = {'type','src','ctaUrl','width','height','css'}
// className relevant to TARGET website
// 'height','css' don't hold any relevance right now
// add any random value to 'width', for specific iframe cases
// CONSIDER modifying the functionality of this function to better fit TARGET websites
// Functionality for type:script commented out, to be added later
// CONSIDER editing functionality for type:html to better fit source HTML
function addBanner(banner,className,parentWidth,parentHeight) {
  // IFRAMESRC
  if(banner.type=='iframeSrc') {
    if(className=='linkedin' || className=='macys' || className=='ulta' || className=='amazon'){
      const container = document.createElement('div');
      container.classList.add('container');

      if(className=='linkedin') {
         var headerContainer = document.createElement('div');
         headerContainer.classList.add('headerContainer');
  
         var imageContainer = document.createElement('div');
         imageContainer.classList.add('imageContainer');
 
         var profile = document.createElement('img');
         profile.classList.add('img');
         profile.src = chrome.runtime.getURL('../images/OAG-Icon-32.png');
         imageContainer.appendChild(profile);
 
         headerContainer.appendChild(imageContainer)
 
         var nameSpan = document.createElement('div');
         nameSpan.classList.add('nameSpan');
         nameSpan.innerText = 'Oui Ad Good';
         headerContainer.appendChild(nameSpan);
 
         container.appendChild(headerContainer);
      }

      var iframeElement;
      container.style.paddingLeft = '0px';
      container.style.paddingRight = '0px';
      if(banner.width) {
        iframeElement = createIframeHW(banner.src, parentWidth, banner.height);
        
      }
      else {
        iframeElement = createIframe(banner.src);
        if(className=='ulta') {
          iframeElement.style.marginLeft = '12.5vw';
          iframeElement.style.marginRight = '12.5vw';
        }
        if(className=='macys') {
          iframeElement.style.display = 'flex';
          iframeElement.style.justifyContent = 'center';
        }
      }

      const ctaButton = createCTAButton(banner.ctaUrl);
      
      container.appendChild(iframeElement);
      container.appendChild(ctaButton);
      bannerContainer.appendChild(container);
    }
    else {
      const container = document.createElement('div');
      container.classList.add('container');

      if(className=='facebook') {
        var headerContainer = document.createElement('div');
        headerContainer.classList.add('headerContainer');

        var imageContainer = document.createElement('div');
        imageContainer.classList.add('imageContainer');


        var profile = document.createElement('img');
        profile.classList.add('img');
        profile.src = chrome.runtime.getURL('../images/OAG-Icon-32.png');
        imageContainer.appendChild(profile);

        headerContainer.appendChild(imageContainer)

        var nameSpan = document.createElement('div');
        nameSpan.classList.add('nameSpan');
        nameSpan.innerText = 'Oui Ad Good';
        headerContainer.appendChild(nameSpan);

        container.appendChild(headerContainer);
      }

      var iframeElement;
      if(banner.width) {
        iframeElement = createIframeHW(banner.src, parentWidth, banner.height);
      }
      else {
        iframeElement = createIframe(banner.src);
        if(className=='ulta') {
          iframeElement.style.marginLeft = '12.5vw';
          iframeElement.style.marginRight = '12.5vw';
        }
        if(className=='macys') {
          iframeElement.style.display = 'flex';
          iframeElement.style.justifyContent = 'center';
        }
      }

      const ctaButton = createCTAButton(banner.ctaUrl);
      container.appendChild(iframeElement);
      container.appendChild(ctaButton);
      bannerContainer.appendChild(container);
    }
  }
  // SCRIPT
  else if(banner.type=='script') {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    
    const ctaButton = createCTAButton(banner.ctaUrl);
  }
  // HTML
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
        
        if(className === 'ulta') {
          const iframeElements = bannerContainer.getElementsByClassName('iframe');
          for (const iframeElement of iframeElements) {
            iframeElement.style.marginLeft = '12.5vw';
            iframeElement.style.marginRight = '12.5vw';
          }
        }
      })
      .catch(error => console.error('Error fetching content:', error));
  }    
}

// Create "OuiAdGood_Container" CONTAINER
// Call to create BANNERS, then append them to the CONTAINER
function createBanner(obj, className, parentWidth, parentHeight) {
  bannerContainer = document.createElement('div');
  bannerContainer.classList.add('OuiAdGood_Container');
  bannerContainer.id = className;

  for (banner of obj.banners) {
    // CLASSNAME relevant to TARGET website, to help with tailoring CSS for 
    addBanner(banner, className, parentWidth, parentHeight);
  }

  console.log("CONTAINER : ",bannerContainer);
  return bannerContainer;
}

// Place "OuiAdGood Container" CONTAINER in association with the TARGET ELEMENT
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

// ENTRY POINT TO CONTENT SCRIPT FOR TARGET WEBSITES
// Checks IF the TARGET ELEMENT is found and proper,
// then Creates "OuiAdGood_Container" CONTAINER and places it in association with the TARGET ELEMENT
// then Creates inner BANNERS dynamically and appends them to the conatainer.
function checkCurrent() {
  var url = window.location.href;
  for (const obj of elementConditions) {
    if(checkUrl(url,obj.target)){
      console.log("MATCHED : ",obj.target);
      var targetElement = findElement(obj.selector);
      if(targetElement) {
        console.log("FOUND : ",targetElement);
        createBanner(obj,obj.target,targetElement.offsetWidth,targetElement.offsetHeight);
        if(bannerContainer) {
          placeElement(targetElement,obj.placement)
        }
      }
      else console.log("NOT FOUND!!!");
      break;
    }
  }
}

// REMOVE banners if SCRIPTS NOT ENABLED (POPUP)
function removeBanner() {
  if (bannerContainer && bannerContainer.parentNode) {
    bannerContainer.parentNode.removeChild(bannerContainer);
    bannerContainer = null;
    bannersAdded = false; // Reset banner addition flag
  }
}

// GOOGLE TAG MANAGER FLOW 
function injectTrackingCodes() {
  if (!trackingCodesInjected) {
    injectFacebookPixel();
    injectGoogleAnalytics();
    trackingCodesInjected = true; // Mark tracking codes as injected
  }
}

function injectGoogleTagManager() {
  injectGTMHead();
  injectGTMBody();
}

function injectGTMHead() {
  if (!document.getElementById('gtmHead')) {
    const script = document.createElement('script');
    script.id = 'gtmHead';
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-W2V9LSSZ');`;
    document.head.appendChild(script);
  }
}

function injectGTMBody() {
  if (!document.getElementById('gtmBody')) {
    const noscript = document.createElement('noscript');
    noscript.id = 'gtmBody';
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W2V9LSSZ"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);
  }
}

chrome.storage.sync.get(['enabled'], function (result) {
  scriptEnabled = result.enabled;
  if (scriptEnabled) {
    injectTrackingCodes();
    injectGoogleTagManager(); // Add this line to inject GTM when your script runs
    addImageInIframeWithConditions();
  }
});

// // Include this call in your existing chrome.runtime.onMessage.addListener callback as well.


function injectFacebookPixel() {
  if (!document.getElementById('fbPixelScript')) { // Check if the FB Pixel script is already added
    // Facebook Pixel script
    const fbPixelScript = document.createElement('script');
    fbPixelScript.id = 'fbPixelScript'; // Assign an ID to the script for identification
    fbPixelScript.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '492030411555076');fbq('track', 'PageView');`;
    document.head.appendChild(fbPixelScript);
  
    // Facebook Pixel no-script
    const fbPixelNoscript = document.createElement('noscript');
    const fbPixelImg = document.createElement('img');
    fbPixelImg.setAttribute('height', '1');
    fbPixelImg.setAttribute('width', '1');
    fbPixelImg.setAttribute('style', 'display:none');
    fbPixelImg.setAttribute('src', 'https://www.facebook.com/tr?id=492030411555076&ev=PageView&noscript=1');
    fbPixelNoscript.appendChild(fbPixelImg);
    document.head.appendChild(fbPixelNoscript);
  }
}

function injectGoogleAnalytics() {
  if (!document.getElementById('gaScript')) { // Check if the GA script is already added
    // Google Analytics script
    const gaScript = document.createElement('script');
    gaScript.id = 'gaScript'; // Assign an ID to the script for identification
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-95QCLZH6ER';
    document.head.appendChild(gaScript);

    const gaScript2 = document.createElement('script');
    gaScript2.textContent = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-95QCLZH6ER');`;
    document.head.appendChild(gaScript2);
  }
}