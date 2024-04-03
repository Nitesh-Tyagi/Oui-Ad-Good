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
  