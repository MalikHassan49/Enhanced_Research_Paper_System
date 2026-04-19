const addTeacher = document.getElementById("add-teacher-btn");

addTeacher.addEventListener("click", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "addTeacher.html";
  }, 100)
})