// submitPaper.html (Files temporary store in browser code)
const fileUpload = document.getElementById("fileUpload");
const fileText = document.getElementById("fileText");
const fileError = document.getElementById("fileError");


fileUpload.addEventListener("change", () => {
  console.log("File data: ", fileUpload.files);
  console.log("First File data: ", fileUpload.files[0]);

  const file = fileUpload.files[0];

  if (file) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

    fileText.textContent = `${file.name} (${fileSizeMB}MB)`

    fileError.textContent = "";

    if (fileSizeMB > 10 * 1024 * 1024) {
      fileError.textContent = "You cannot upload file greater than 10MB.";
      fileUpload.value = "";

      fileText.textContent = "";
    }
  }
}
);

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
        // back to dashboard
        setTimeout(() => {
          window.location.href = "../student-dashboard/studentDashboard.html";
        }, 3000)
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
  }, 2000)
})