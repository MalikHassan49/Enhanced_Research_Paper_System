const addTeacher = document.getElementById("add-teacher-btn");

addTeacher.addEventListener("click", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "addTeacher.html";
  }, 100)
})

// All teachers

const allTeachers = document.getElementById("all-teachers");

allTeachers.addEventListener("click", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "allTeachers.html";
  }, 100)
})


// All students

const allStudents = document.getElementById("all-students");

allStudents.addEventListener("click", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "allStudents.html";
  }, 100)
})

// All papers

const allPapers = document.getElementById("all-papers");

allPapers.addEventListener("click", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "allPapers.html";
  }, 100)
})