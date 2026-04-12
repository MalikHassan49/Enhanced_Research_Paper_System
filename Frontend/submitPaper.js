// submitPaper.html (Files temporary store in browser code)
const fileUpload = document.getElementById("fileUpload");
const fileText = document.getElementById("fileText");

console.log(fileUpload);

fileUpload.addEventListener("change", () => {
  console.log("File data: ", fileUpload.files);
  console.log("First File data: ", fileUpload.files[0]);

  if (fileUpload.files.length > 0) {
    fileText.textContent = fileUpload.files[0].name;
  }

});

// send request to backend
const submitBtn = document.getElementById("submit-button");
const paperTitle = document.getElementById("paper-title").value;
const paperAbstract = document.getElementById("paper-abstract").value;

submitBtn.addEventListener("click", async () => {

  const formData = new FormData();

  formData.append("paperTitle", paperTitle);
  formData.append("paperAbstract", paperAbstract);
  formData.append("file", fileUpload.files[0]);

  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/papers/submit-paper",
      {
        method: "POST",
        credentials: "include",
        body: formData
      }
    );

    const data = response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});