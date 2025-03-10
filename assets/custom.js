// Get the image elements and the popup element
var images = document.getElementsByClassName('rimage__image');
var popup = document.getElementById('popup');

// Add event listeners to each image
Array.from(images).forEach(function(image) {
   Show the popup on mouseover
  image.addEventListener('mouseover', function() {
    image.click();
  });
});

// Hide the popup on mouseout
popup.addEventListener('mouseout', function() {
  popup.style.display = 'none';
});




