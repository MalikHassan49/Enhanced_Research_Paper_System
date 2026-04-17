

async function allSubmittedPapers() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/papers/all-submitted-papers",
      {
        method: "GET",
        credentials: "include"
      }
    )

    const responseData = await response.json();

    console.log("Response Data: ", responseData);

    const container = document.querySelector(".review-papers-container");
    if (responseData.data.length > 0) {
      container.style.display = "flex";
      responseData.data.forEach(paper => {
        const card = document.createElement("div");
        card.classList.add("paper");
        card.innerHTML = `
        <div class = "user-info-container">
        <p class = "username">By: ${paper.student.username}</p>
        <p class = "status">${paper.status}</p>
        </div>
        <h1 class = "paper-title">${paper.paperTitle}</h1>
        <p class = "paper-abstract">${paper.paperAbstract}</p>
        <div class = "paper-name-container">
        <p class = "file-name">${paper.file.filename}</p>
        <button class = "view-paper-btn">Review Paper</button>
        </div>
        `
        container.appendChild(card);
      });

    } else {
      document.querySelector(".review-papers-available-container").style.display = "block";
    }
  } catch (error) {
    console.log(error);
  }
}

allSubmittedPapers();

const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "teacherDashboard.html";
  }, 200)
})

// view paper page

document.addEventListener("click", (e) => {
  if (e.target.classList.contains('view-paper-btn')) {
    document.body.classList.add('fade-out');

    setTimeout(() => {
      window.location.href = "viewPaper.html";
    }, 100)
  }
})