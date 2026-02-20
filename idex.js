document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("menp").addEventListener("click", () => {
    window.open("./men.html", "_blank");
  });

  document.getElementById("womenp").addEventListener("click", () => {
    window.open("./women.html", "_blank");
  });

  document.getElementById("childp").addEventListener("click", () => {
    window.open("./kids.html", "_blank");
  });

  document.getElementById("footp").addEventListener("click", () => {
    window.open("./footwear.html", "_blank");
  });

  document.getElementById("beautyp").addEventListener("click", () => {
    window.open("./beauty.html", "_blank");
  });

  const sld = [
    "./temp/Capture14.PNG",
    "./temp/Capture12.PNG",
    "./temp/Capture26.PNG",
    "./temp/Capture47.PNG"
  ];

  let index = 0;
  const slide = document.querySelector(".slide");

  function showSlide(i) {
    index = (i + sld.length) % sld.length;
    slide.src = sld[index];
  }

  setInterval(() => {
    showSlide(index + 1);
  }, 3000);

  document.querySelector(".im").addEventListener("click", ()=>{
    window.open("./index.html","_self");
  }

  
);

});
