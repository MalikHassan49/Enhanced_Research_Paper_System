const reviewBtn = document.getElementById("review-btn");

reviewBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "reviewPapers.html";
  }, 100)
})