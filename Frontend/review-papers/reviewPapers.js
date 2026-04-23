
const pageNumber = document.getElementById("page-number");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const arrowUp = document.getElementById("arrow-up");
const arrowDown = document.getElementById("arrow-down");

let currentPage = 1;
const limit = 9;

async function allSubmittedPapers(page) {

  try {
    const response = await fetch(`http://127.0.0.1:5000/api/v1/papers/all-submitted-papers?page=${page}&limit=${limit}`,
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
    console.log("Papers: ", papers);
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
        card.innerHTML = `
        <div class = "user-info-container">
        <p class = "username">By: ${paper.studentId.username}</p>
        <p class = "status">${paper.status}</p>
        </div>
        <h1 class = "paper-title">${paper.paperTitle}</h1>
        <p class = "paper-abstract">${paper.paperAbstract}</p>
        <div class = "paper-name-container">
        <p class = "file-name">${paper.file.filename}</p>
        <button class = "view-paper-btn" data-paper-id = "${paper._id}" data-file-url = "${paper.file.url}" >Review Paper</button>
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
    window.location.href = "../teacher-dashboard/teacherDashboard.html";
  }, 200)
})

// view paper page

document.addEventListener("click", (e) => {
  if (e.target.classList.contains('view-paper-btn')) {
    document.body.classList.add('fade-out');

    const paperId = e.target.dataset.paperId;
    const fileUrl = e.target.dataset.fileUrl;

    setTimeout(() => {
      window.location.href = `../view-paper/viewPaper.html?id=${paperId}&url=${encodeURIComponent(fileUrl)}`;
    }, 100)
  }
})