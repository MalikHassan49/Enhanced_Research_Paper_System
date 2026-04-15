
async function fetchPapersData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/papers/student-papers",
      {
        method: "GET",
        credentials: "include"
      }
    )

    const responseData = await response.json();
    console.log("Response Data: ", responseData);

    const container = document.querySelector(".papers-container");

    if (responseData.data.length > 0) {
      container.style.display = "flex";
      responseData.data.forEach(paper => {
        const card = document.createElement("div");
        card.classList.add("paper");

        card.innerHTML = `
        <p class = "status">${paper.status}</p>
        <h2 class = "paper-title">${paper.paperTitle}</h2>
        <p class = "paper-abstract">${paper.paperAbstract}</p>
        <div class = "paper-name-container">
          <p class = "file-name">${paper.file.filename}</p>
          <button class = "view-paper-btn">View Paper</button>
        </div>
        `
        container.appendChild(card);
      })
    }
    else {
      document.querySelector(".papers-available-container").style.display = "block";
    }
  } catch (error) {
    console.log(error);
  }
}

fetchPapersData();

// back to student dashboard
const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "studentDashboard.html";
  }, 200)
})