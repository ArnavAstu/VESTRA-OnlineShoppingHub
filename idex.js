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

      Promise.all([
        fetch(url).then(res => res.json()),
        fetch("http://localhost:5000/wishlist").then(res => res.json())
      ])
      .then(([products, wishlist]) => {

        const wishlistIds = wishlist.map(item => item.id);

        container.innerHTML = "";

        if (products.length === 0) {
          container.innerHTML = "<h3>No products found.</h3>";
          return;
        }

        products.forEach(product => {

          const isWishlisted = wishlistIds.includes(product.id);

          const card = document.createElement("div");
          card.classList.add("product-card");

          card.innerHTML = `
            <div class="image-wrapper">
              <button class="wishlist-btn ${isWishlisted ? "active" : ""}">
                <i class="fa-${isWishlisted ? "solid" : "regular"} fa-heart"></i>
              </button>

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

              <button class="add-btn">
                Add to Bag
              </button>
            </div>
          `;

          container.appendChild(card);

          card.querySelector(".add-btn").addEventListener("click", () => {
            fetch("http://localhost:5000/bag", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ product_id: product.id })
            })
            .then(() => showToast("Added to Bag 🛍️"))
            .catch(() => showToast("Something went wrong", "error"));
          });

          const wishlistBtn = card.querySelector(".wishlist-btn");

          wishlistBtn.addEventListener("click", function () {

            if (this.classList.contains("active")) {

              fetch("http://localhost:5000/wishlist/" + product.id, {
                method: "DELETE"
              })
              .then(() => {
                this.classList.remove("active");
                this.innerHTML = '<i class="fa-regular fa-heart"></i>';
                showToast("Removed from Wishlist 💔", "error");
              });

            } else {

              fetch("http://localhost:5000/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id: product.id })
              })
              .then(() => {
                this.classList.add("active");
                this.innerHTML = '<i class="fa-solid fa-heart"></i>';
                showToast("Added to Wishlist ❤️");
              });

            }

          });

        });

      })
      .catch(() => {
        container.innerHTML = "<h3>Failed to load products.</h3>";
        showToast("Failed to load products", "error");
      });

    }

    loadProducts();
  }

});

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 2500);
}

document.addEventListener("DOMContentLoaded", () => {

  console.log("JS LOADED");

});