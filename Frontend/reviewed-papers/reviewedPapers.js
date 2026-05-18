
async function fetchReviewedPapers() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/papers/reviewed-papers`,
      {
        method: "GET",
        credentials: "include"
      }
    )

    const responseData = await response.json();
    console.log("Response Data: ", responseData);

    const container = document.querySelector(".reviews-container");

    if (responseData.data.length > 0) {
      container.style.display = "flex";
      responseData.data.forEach(review => {
        const card = document.createElement("div");
        card.classList.add("review");

        card.innerHTML = `
        <div class = "reviews-basic-info-container">
        <p class = "username">Submitted By: ${review.studentId.username}</p>
        <p class = "status">${review.status}</p>
        </div>
        <h2 class = "paper-title">${review.paperTitle}</h2>
        <div class = "review-btn-container">
          <button class = "review-btn" id = "review-btn" data-id=${review._id}>View Reviews</button>
        </div>
        `
        container.appendChild(card);
      })
    }
    else {
      document.querySelector(".reviews-available-container").style.display = "block";
    }
  } catch (error) {
    console.log(error);
  }
}

fetchReviewedPapers();

// back to teacher dashboard
const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "../teacher-dashboard/teacherDashboard.html";
  }, 200)
})


// teacher comment 

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("review-btn")) {
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
      <p>Name : ${responseData.data.reviewedBy.username}</p>
      <i id="x-mark" class="fa-solid fa-xmark"></i>
      </div>
       <div class="comment-text-container">
      <p>Comment*</p>
      <textarea name="comment" id="comment" cols="30" rows="6">
      ${responseData.data.teacherComment}
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


const reviewFirstPaperBtn = document.getElementById("review-first-paper-btn");

reviewFirstPaperBtn.addEventListener("click", () => {
  setTimeout(() => {
    window.location.href = "../review-papers/reviewPapers.html";
  }, 1000)
})