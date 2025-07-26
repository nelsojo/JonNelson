document.addEventListener("DOMContentLoaded", () => {
  const fadeSections = document.querySelectorAll(".fade-section");

  function checkFade() {
    const triggerBottom = window.innerHeight * 0.85;

    fadeSections.forEach((section, index) => {
      const top = section.getBoundingClientRect().top;

      if (top < triggerBottom && !section.classList.contains("visible")) {
        // Add a stagger based on index of the element
        setTimeout(() => {
          section.classList.add("visible");
        }, index * 75); // 150ms delay per card
      }
    });
  }

  window.addEventListener("scroll", checkFade);
  checkFade(); // Run on page load
  window.addEventListener("resize", checkFade); // Re-check on resize 
  window.addEventListener("load", checkFade); // Re-check on full load
  window.addEventListener("DOMContentLoaded", checkFade); // Re-check when DOM is ready

});
