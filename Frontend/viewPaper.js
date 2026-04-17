// back to review paper page
const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "reviewPapers.html";
  }, 200)
})

// send request to backend
const reviewBtn = document.getElementById("review-btn");

reviewBtn.addEventListener("click", async () => {
  const comment = document.getElementById("paper-comment").value;
  const paperStatus = document.getElementById("paperStatus").value;
  
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/papers/:id/review-paper", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        comment,
        paperStatus
      })
    }
    );

    const responseData = await response.json();
    const container = document.querySelector(".result-submittion-container");
    if (responseData.data.length > 0) {
      container.innerHTML = `
      <p>Review submitted successfully!</p>
      `
    }
  } catch (error) {
    console.log(error);
  }
})