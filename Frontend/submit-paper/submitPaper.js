// submitPaper.html (Files temporary store in browser code)
const fileUpload = document.getElementById("fileUpload");
const fileText = document.getElementById("fileText");


fileUpload.addEventListener("change", () => {
  console.log("File data: ", fileUpload.files);
  console.log("First File data: ", fileUpload.files[0]);

  if (fileUpload.files.length > 0) {
    fileText.textContent = fileUpload.files[0].name;
  }
});

// send request to backend
const paperTitle = document.getElementById("paper-title");
const paperAbstract = document.getElementById("paper-abstract");

// form submission
const submitBtn = document.getElementById("submit-button");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("paperTitle", paperTitle.value);
  formData.append("paperAbstract", paperAbstract.value);
  formData.append("file", fileUpload.files[0]);

  console.log("Before fetch");
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/papers/submit-paper`,
      {
        method: "POST",
        credentials: "include",
        body: formData
      }
    );

    console.log("After fetch");
    console.log("Response without fetch: ", response);

    const responseData = await response.json();
    console.log("Response Data: ", responseData);

    if (response.ok) {
      const credentialsContainer = document.querySelector(".credentials-container");
      if (credentialsContainer) {
        credentialsContainer.innerHTML = `
        <p>Paper Submitted Successfully</p>
      `
      }
      else {
        credentialsContainer.innerHTML = `
        <p style ="color: red;">Submit Failed</p>
      `
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// back to student dashboard
const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "../student-dashboard/studentDashboard.html";
  }, 200)
})