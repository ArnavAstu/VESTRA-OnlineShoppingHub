document.addEventListener("DOMContentLoaded", () => {

  const navLinks = {
    menp: "men.html",
    womenp: "women.html",
    childp: "kids.html",
    footp: "footwear.html",
    beautyp: "beauty.html"
  };

  Object.keys(navLinks).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", () => {
        window.open(`./${navLinks[id]}`, "_blank");
      });
    }
  });

  const slide = document.querySelector(".slide");

  if (slide) {
    const slides = [
      "./temp/Capture14.PNG",
      "./temp/Capture12.PNG",
      "./temp/Capture26.PNG",
      "./temp/Capture47.PNG"
    ];

    let index = 0;

    setInterval(() => {
      index = (index + 1) % slides.length;
      slide.src = slides[index];
    }, 3000);
  }

const logo = document.querySelector(".im");
  if (logo) {
    logo.addEventListener("click", () => {
      window.open("./index.html", "_self");
    });
  }

  // Featured Products for homepage
  const featuredContainer = document.getElementById("featured-products");
  if (featuredContainer) {
    const featuredProducts = [
      {id: 'feat-1', name: 'Classic Shirt', brand: 'Vestra Mens', price: 1299, image: './pics/men pics/ChatGPT Image Feb 8, 2026, 10_13_22 PM.png'},
      {id: 'feat-2', name: 'Designer Dress', brand: 'Vestra Womens', price: 2499, image: './pics/panel/ChatGPT Image Feb 8, 2026, 07_18_33 PM.png'},
      {id: 'feat-3', name: 'Kids Combo', brand: 'Vestra Kids', price: 999, image: './pics/kids pics/ChatGPT Image Feb 8, 2026, 11_01_06 PM.png'},
      {id: 'feat-4', name: 'Running Shoes', brand: 'Vestra Sports', price: 2999, image: './pics/panel/footwear.png'}
    ];
    if (typeof createProductCard === 'function') {
      featuredContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    }
  }

  const container = document.getElementById("productContainer");

  if (container && typeof pageCategory !== "undefined") {

    let sortValue = "";

    const sortSelect = document.getElementById("sortSelect");

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        sortValue = sortSelect.value;
        loadProducts();
      });
    }

    function loadProducts() {

      let url = `http://localhost:5000/products?category=${pageCategory}`;

      if (sortValue) {
        url += `&sort=${sortValue}`;
      }

      fetch(url)
        .then(res => res.json())
        .then(products => {

          container.innerHTML = "";

          if (products.length === 0) {
            container.innerHTML = "<h3>No products found.</h3>";
            return;
          }

          products.forEach(product => {

            const card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
              <div class="image-wrapper">
                <img 
                  src="${product.image}" 
                  alt="${product.name}"
                  onmouseover="this.src='${product.hover_image}'"
                  onmouseout="this.src='${product.image}'"
                >
              </div>

              <div class="product-info">
                <h4 class="brand">${product.brand}</h4>
                <p class="name">${product.name}</p>

                <div class="price-section">
                  <span class="price">₹${product.price}</span>
                  <span class="old-price">₹${product.old_price}</span>
                  <span class="discount">${product.discount}% OFF</span>
                </div>

                <div class="rating">
                  ⭐ ${product.rating} | ${product.reviews}
                </div>

                <button class="add-btn">Add to Bag</button>
              </div>
            `;

            container.appendChild(card);
          });

        })
        .catch(err => {
          console.error("Error fetching products:", err);
          container.innerHTML = "<h3>Failed to load products.</h3>";
        });
    }

    loadProducts();
  }

});