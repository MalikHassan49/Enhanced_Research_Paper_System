// back to review paper page
const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "../review-papers/reviewPapers.html";
  }, 1000)
})

// URL params come from reviewPaper.html file
const params = new URLSearchParams(window.location.search);
const paperId = params.get("id");
const fileUrl = params.get("url") ? decodeURIComponent(params.get("url")) : "";
const paperTitle = params.get("title") ? decodeURIComponent(params.get("title")) : "";
console.log("paperId: ", paperId);
console.log("fileUrl: ", fileUrl);
console.log("paperTitle: ", paperTitle);

// send request to backend
const reviewBtn = document.getElementById("review-btn");

reviewBtn.addEventListener("click", async () => {
  const comment = document.getElementById("paper-comment").value;
  const paperStatus = document.getElementById("paperStatus").value;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/papers/${paperId}/review-paper`, {
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
    console.log(responseData);
    const container = document.querySelector(".result-submittion-container");
    container.innerHTML = `
      <p>Review submitted successfully!</p>
      `
  } catch (error) {
    console.log(error);
  }
})

// open the file in new tab

const buttonsContainer = document.querySelector(".buttons-container");

buttonsContainer.innerHTML = `
      <a href="${fileUrl}" target="_blank" rel="noopener noreferrer">
        <button type="button" class="view-paper-btn">View Paper</button>
      </a>
      <button type="button" class="generate-ai-summary-btn">Generate AI Summary</button>
      <button type="button" class="chat-with-paper-btn">Chat with Paper</button>
`;

const aiSummaryContainer = document.querySelector(".ai-summary-container");
const summaryContainer = document.querySelector(".summary-container");
const generateSummaryBtn = document.querySelector(".generate-ai-summary-btn");
const chatWithPaperBtn = document.querySelector(".chat-with-paper-btn");

chatWithPaperBtn.addEventListener("click", () => {
  if (!paperId) {
    alert("Paper ID is missing. Please return to a valid paper review page.");
    return;
  }

  const chatUrl = new URL("../paper-chat/paperChat.html", window.location.href);
  chatUrl.searchParams.set("id", paperId);

  if (paperTitle) {
    chatUrl.searchParams.set("title", paperTitle);
  }

  if (fileUrl) {
    chatUrl.searchParams.set("url", fileUrl);
  }

  window.location.href = chatUrl.toString();
});

generateSummaryBtn.addEventListener("click", async () => {
  generateSummaryBtn.disabled = true;
  generateSummaryBtn.innerText = "Generating...";
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/papers/${paperId}/generate-summary`, {
      method: "GET",
      credentials: "include"
    });

    const responseData = await response.json();
    console.log("Response Data: ", responseData);
    if (response.ok) {
      setTimeout(() => {
        aiSummaryContainer.style.display = "block";
        summaryContainer.innerText = responseData.data.summary;
        generateSummaryBtn.innerHTML = "Generate AI Summary";
      }, 1000)

    }
  } catch (error) {
    console.log("Error: ", error);
  }
})












// move to pdfViewer.html file

{/* <button id="viewBtn">View Paper</button> */ }


// document.getElementById("viewBtn").addEventListener("click", () => {

//   window.location.href = `pdfViewer.html?file=${encodeURIComponent(fileUrl)}`;
// });


// let fullUrl = fileUrl;

// // agar local path hai
// if(fileUrl.startsWith("/temp")) {
//   fullUrl = `http://localhost:5000${fileUrl}`;
// }