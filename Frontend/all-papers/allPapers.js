
const pageNumber = document.getElementById("page-number");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");

let currentPage = 1;
const limit = 9;

async function allSubmittedPapers(page) {

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/papers/all-papers?page=${page}&limit=${limit}`,
      {
        method: "GET",
        credentials: "include"
      }
    )
    pageNumber.style.display = "block";
    leftBtn.style.display = "block";
    rightBtn.style.display = "block";

    const responseData = await response.json();

    const papers = responseData.data.papers;
    const totalPages = responseData.data.totalPages;
    const totalPapers = responseData.data.totalPapers;
    console.log("Papers limit: ", papers);
    console.log("Total Pages: ", totalPages);
    console.log("Total Papers: ", totalPapers);

    console.log("Response Data: ", responseData);

    const container = document.querySelector(".review-papers-container");

    container.innerHTML = "";
    if (responseData.data.papers.length > 0) {
      container.style.display = "flex";

      responseData.data.papers.forEach(paper => {
        const card = document.createElement("div");
        card.classList.add("paper");

        card.innerHTML += `
        <div class = "user-info-container">
        <p class = "username">Reviewed By: ${paper.reviewedBy?.username || "None"}</p>
        <p class = "status">${paper.status}</p>
        </div>
        <h1 class = "paper-title">${paper.paperTitle}</h1>
        <p class = "paper-abstract">${paper.paperAbstract}</p>
        <div class = "paper-name-container">
        <button class = "delete-btn" data-paper-id = "${paper._id}">Delete Paper</button>
        <button class = "confirm-assign-btn" data-title ="${paper.title}" data-paper-id = "${paper._id}">Assign Teacher</button>
        </div>
        `
        container.appendChild(card);
      });

    } else {
      document.querySelector(".review-papers-available-container").style.display = "block";
      pageNumber.style.display = "none";
      leftBtn.style.display = "none";
      rightBtn.style.display = "none";
    }

    pageNumber.innerText = currentPage;
    // disable buttons
    leftBtn.disabled = currentPage == 1;
    rightBtn.disabled = currentPage == totalPages;
  } catch (error) {
    console.log(error);
  }
}

// first time send request
allSubmittedPapers(currentPage);

// get next 9 docs
rightBtn.addEventListener("click", () => {
  currentPage++;
  allSubmittedPapers(currentPage);
})

// get previous 9 docs
leftBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    allSubmittedPapers(currentPage);
  }
})


const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "../admin/admin.html";
  }, 200)
})

// delete paper 

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains('delete-btn')) {

    const paperId = e.target.dataset.paperId;

    const card = e.target.closest(".paper");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/papers/${paperId}/delete-paper`, {
        method: "DELETE",
        credentials: "include"
      });

      const responseData = await response.json();

      console.log(responseData);

      if (response.ok) {
        card.style.opacity = "0";
        setTimeout(() => {
          card.remove();
        }, 300)
      }
    } catch (error) {
      console.log(error);
    }
  }
})

// assign teacher pop-up box
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("confirm-assign-btn")) {
    document.body.classList.add("fade-low");
    const paperTitle = e.target.dataset.title;;
    const selectTeacherContainer = document.querySelector(".select-teacher-container");
    selectTeacherContainer.dataset.paperId = e.target.dataset.paperId;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/all-teachers`, {
        method: "GET",
        credentials: "include"
      });

      const responseData = await response.json();
      console.log("Response Data: ", responseData);
      const teacherOptionContainer = document.querySelector(".teachers-option-container");
      teacherOptionContainer.innerHTML = "";
      if (responseData.data) {
        responseData.data.forEach(teacher => {
          const card = document.createElement("div");
          card.classList.add("option-container");
          card.innerHTML += `
          <input type="radio" name="teacher" id="${teacher._id}" value="${teacher._id}">
        <label for="${teacher._id}">Sir ${teacher.username}</label>
          `
          teacherOptionContainer.appendChild(card);
          document.querySelector(".select-teacher-container").style.display = "flex";
        });

      }

      // remove the pop-up 
      const xmark = document.getElementById("x-mark");
      xmark.addEventListener("click", () => {
        document.querySelector(".select-teacher-container").style.display = "none";
        document.body.classList.remove('fade-low');
      })


    } catch (error) {
      console.log("Major Error: ", error);
    }
  }

  // select the teacher
  if (e.target.classList.contains("assign-btn")) {
    const selectedTeacher = document.querySelector("input[name=teacher]:checked");

    // extract the paperId
    const selectTeacherContainer = document.querySelector(".select-teacher-container");
    const paperId = selectTeacherContainer.dataset.paperId;
    console.log("PaperId: ", paperId);
    if (selectedTeacher) {
      console.log(selectedTeacher.value);
      console.log(selectedTeacher.id);
      const teacherId = selectedTeacher.value;
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/papers/${paperId}/assign-teacher`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            teacherId
          })
        });

        const responseData = await response.json();
        console.log("ResponseData: ", responseData);
        const teacherCredentialsContainer = document.querySelector('.teacher-credentials-container');
        teacherCredentialsContainer.innerHTML = `
              <p>Teacher assigned succesfully</p>
              `
      } catch (error) {
        console.log(error);
      }
    }
  }

  // cancel btn
  if (e.target.classList.contains("cancel-btn")) {
    const selectedTeacher = document.querySelector("input[name=teacher]:checked");
    if (selectedTeacher) {
      selectedTeacher.checked = false;
    }
    document.querySelector(".select-teacher-container").style.display = "none";
    document.body.classList.remove("fade-low");
  }
})