const backBtn = document.querySelector(".back-btn");

backBtn.addEventListener("click", () => {
  setTimeout(() => {
    window.location.href = "../login/login.html";
  }, 1000);
})