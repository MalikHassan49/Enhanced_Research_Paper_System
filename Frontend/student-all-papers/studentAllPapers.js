const submitFirstPaperBtn = document.getElementById("submit-first-paper-btn");

async function fetchPapersData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/papers/student-papers`,
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
          <button class = "comment-btn" id = "comment-btn" data-id=${paper._id}>View Comment</button>
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
    window.location.href = "../student-dashboard/studentDashboard.html";
  }, 200)
})


// teacher comment 

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("comment-btn")) {
    document.body.classList.add("low-fade");

    const paperId = e.target.dataset.id;
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/papers/${paperId}/comment`, {
        method: "GET",
        credentials: "include"
      });

      const responseData = await response.json();
      console.log("Response Data: ", responseData);
      const commentContainer = document.querySelector(".teacher-comment-container");

      if (responseData.data) {
        commentContainer.innerHTML = `
      <div class = "comment-name-container">
      <p>Reviewed By : ${responseData.data.reviewedBy?.username || "No Reviewed yet."}</p>
      <i id="x-mark" class="fa-solid fa-xmark"></i>
      </div>
       <div class="comment-text-container">
      <p>Comment*</p>
      <textarea name="comment" id="comment" cols="30" rows="6" readonly>
      ${responseData.data.teacherComment?.trim() || "No comments yet."}
      </textarea>
    </div>
      `
        commentContainer.style.display = "block";
        // close the comment container

        const xmark = document.getElementById("x-mark");

        xmark.addEventListener("click", () => {
          commentContainer.style.display = "none";
          document.body.classList.remove("low-fade");
        })

      }
    } catch (error) {
      console.log(error);
    }
  }

})

// submit first paper
submitFirstPaperBtn.addEventListener("click", () => {
  setTimeout(() => {
    window.location.href = "../submit-paper/submitPaper.html";
  }, 1000)
})

