document.addEventListener("DOMContentLoaded", () => {


  const menp = document.getElementById("menp");
  if (menp) {
    menp.addEventListener("click", () => {
      window.open("./men.html", "_blank");
    });
  }

  const womenp = document.getElementById("womenp");
  if (womenp) {
    womenp.addEventListener("click", () => {
      window.open("./women.html", "_blank");
    });
  }

  const childp = document.getElementById("childp");
  if (childp) {
    childp.addEventListener("click", () => {
      window.open("./kids.html", "_blank");
    });
  }

  const footp = document.getElementById("footp");
  if (footp) {
    footp.addEventListener("click", () => {
      window.open("./footwear.html", "_blank");
    });
  }

  const beautyp = document.getElementById("beautyp");
  if (beautyp) {
    beautyp.addEventListener("click", () => {
      window.open("./beauty.html", "_blank");
    });
  }


  const slide = document.querySelector(".slide");

  if (slide) {
    const slides = [
      "./temp/Capture14.PNG",
      "./temp/Capture12.PNG",
      "./temp/Capture26.PNG",
      "./temp/Capture47.PNG"
    ];

    let index = 0;

    function showSlide(i) {
      index = (i + slides.length) % slides.length;
      slide.src = slides[index];
    }

    setInterval(() => {
      showSlide(index + 1);
    }, 3000);
  }


  const logo = document.querySelector(".im");
  if (logo) {
    logo.addEventListener("click", () => {
      window.open("./index.html", "_self");
    });
  }

  const container = document.getElementById("productContainer");

  if (container) {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(products => {

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
                <span class="discount">${product.discount}</span>
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
      });
  }

});