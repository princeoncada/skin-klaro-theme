let flickityInstance;
  let thumbnailFlickityInstance;
  let selectedVariantId = null;
  
      // Initialize Flickity for the thumbnail carousel
      thumbnailFlickityInstance = new Flickity('#thumbnailCarousel', {
        asNavFor: '#mainCarousel',
        contain: true,
        pageDots: false,
        prevNextButtons: false,
        draggable: true,
        freeScroll: false,
        cellAlign: 'left',
      });

    $(document).ready(function () {
        variantSelector();
        disableCheckoutButton();
    });

  function variantSelector(){
        // Initialize Flickity for the main carousel
        flickityInstance = new Flickity('#mainCarousel', {
            wrapAround: true,
            pageDots: false,
            prevNextButtons: false,
            draggable: true,
          });
    var firstVariantButton = document.querySelectorAll(".variant-button.active");
    if (firstVariantButton) {
        changeVariant(firstVariantButton);
      }
  }
  function disableCheckoutButton() {
    const checkoutButton = document.querySelectorAll('checkoutButton');
    if (checkoutButton.disabled) {
      checkoutButton.classList.add('x-opacity-50', 'x-cursor-not-allowed');
    }
  }

  // Function to update the main image and variant images in Flickity
  function changeVariant(button) {
    const buttons = document.querySelectorAll('.variant-button');
    buttons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    selectedVariantId = button.getAttribute('data-variant-id');

    const mainImageUrl = button.getAttribute('data-main-img');
    const variantImages = button.getAttribute('data-img-src');
    const variantAvailability = button.getAttribute('data-availability') === 'true' ? 'Available' : 'Out of Stock';
    const variantPrice = button.getAttribute('data-price');

    // Update availability and price
    document.getElementById('variant-availability').textContent = variantAvailability;
    document.getElementById('variant-price').textContent = variantPrice;

    // Disable checkout button if out of stock
    const checkoutButton = document.getElementById('checkoutButton');
    if (variantAvailability === 'Out of Stock') {
      checkoutButton.disabled = true;
      checkoutButton.classList.add('x-opacity-50', 'x-cursor-not-allowed'); // Add styles for a disabled button
    } else {
      checkoutButton.disabled = false;
      checkoutButton.classList.remove('x-opacity-50', 'x-cursor-not-allowed'); // Remove styles when in stock
    }

    // Clear and update the main and thumbnail carousels
    while (flickityInstance.cells.length > 0) {
      flickityInstance.remove(flickityInstance.cells[0].element);
    }
    while (thumbnailFlickityInstance.cells.length > 0) {
      thumbnailFlickityInstance.remove(thumbnailFlickityInstance.cells[0].element);
    }

    // Add the main image to the main carousel
    const mainImageCell = document.createElement('div');
    mainImageCell.className = 'carousel-cell';
    mainImageCell.innerHTML = `<img src="${mainImageUrl}" alt="Main Product Image" class="w-full h-auto">`;
    flickityInstance.append(mainImageCell);

    // Add the main image to the thumbnail carousel
    const mainThumbnail = document.createElement('div');
    mainThumbnail.className = 'carousel-cell';
    mainThumbnail.innerHTML = `<img src="${mainImageUrl}" alt="Main Product Image" class="cursor-pointer object-cover w-full h-full" onclick="changeImage('${mainImageUrl}')">`;
    thumbnailFlickityInstance.append(mainThumbnail);

    // Add variant images to both carousels if they exist
    if (variantImages) {
      const variantImagesArray = variantImages.split(',');
      variantImagesArray.forEach(function (imageUrl) {
        // Add to the main carousel
        const imageCell = document.createElement('div');
        imageCell.className = 'carousel-cell';
        imageCell.innerHTML = `<img src="${imageUrl.trim()}" alt="Variant Image" class="w-full h-auto">`;
        flickityInstance.append(imageCell);

        // Add to the thumbnail carousel
        const thumbnailCell = document.createElement('div');
        thumbnailCell.className = 'carousel-cell';
        thumbnailCell.innerHTML = `<img src="${imageUrl.trim()}" alt="Variant Thumbnail" class="cursor-pointer object-cover w-full h-full" onclick="changeImage('${imageUrl.trim()}')">`;
        thumbnailFlickityInstance.append(thumbnailCell);
      });
    }

    // Reload Flickity for both carousels
    flickityInstance.reloadCells();
    thumbnailFlickityInstance.reloadCells();
    flickityInstance.select(0);
    thumbnailFlickityInstance.select(0); // Highlight the first thumbnail
  }


  // Main image update
  function changeImage(imageUrl) {
    const mainImage = document.getElementById('mainImage');
    fadeOut(mainImage, function () {
      mainImage.src = imageUrl;
      fadeIn(mainImage);
    });

    // Connection between thumbnail and image selected
    const thumbnailIndex = Array.from(thumbnailFlickityInstance.cells).findIndex(
      (cell) => cell.element.querySelector('img').src === imageUrl
    );
    if (thumbnailIndex >= 0) {
      thumbnailFlickityInstance.select(thumbnailIndex);
    }
  }

  // Fade out effect
  function fadeOut(element, callback) {
    element.style.opacity = 1;
    (function fade() {
      if ((element.style.opacity -= 0.1) < 0) {
        element.style.display = 'none';
        if (callback) callback();
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  // Fade in effect
  function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    (function fade() {
      let val = parseFloat(element.style.opacity);
      if (!((val += 0.1) > 1)) {
        element.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }

  // Global variable to track the quantity

  let selectedQuantity = 1;

  // Function to increase quantity
  document.getElementById('increaseQty').addEventListener('click', function () {
    selectedQuantity++;
    document.getElementById('quantityInput').value = selectedQuantity;
  });

  // Function to decrease quantity
  document.getElementById('decreaseQty').addEventListener('click', function () {
    if (selectedQuantity > 1) {
      selectedQuantity--;
      document.getElementById('quantityInput').value = selectedQuantity;
    }
  });

  // Checkout button click listener
  document.getElementById('checkoutButton').addEventListener('click', function () {
    if (selectedVariantId) {
      // Ensure selectedQuantity is passed to the addToCart function
      const selectedQuantity = parseInt(document.getElementById('quantityInput').value);
      addToCart(selectedVariantId, selectedQuantity);
    } else {
      alert('Please select a variant before proceeding to checkout.');
    }
  });

  // Add product to cart function
  function addToCart(productId) {
    const checkoutButton = document.getElementById('checkoutButton');
    const quantity = selectedQuantity; // Use the selected quantity
    if (!checkoutButton.disabled) {
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId, quantity: quantity }), // Pass the selected quantity here
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Product added to cart:', data);
          updateCartCount();
        })
        .catch((error) => {
          console.error('Error adding to cart:', error);
        });
    } else {
      alert('The selected variant is out of stock.');
    }
  }

  // Update cart
  function updateCartCount() {
    fetch('/cart.js')
      .then((response) => response.json())
      .then((cart) => {
        const cartCountBubble = document.querySelector('.cart-count-bubble');
        const cartItemCount = cart.item_count;

        // Update the cart count in the header
        cartCountBubble.textContent = cartItemCount;

        // Show or hide the bubble based on cart count
        if (cartItemCount > 0) {
          cartCountBubble.classList.remove('hide');
        } else {
          cartCountBubble.classList.add('hide');
        }
      })
      .catch((error) => {
        console.error('Error fetching cart data:', error);
      });
  }