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
const paperTitle = document.getElementById("paper-title");
const paperAbstract = document.getElementById("paper-abstract");

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData();

  formData.append("paperTitle", paperTitle.value);
  formData.append("paperAbstract", paperAbstract.value);
  formData.append("file", fileUpload.files[0]);

  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/papers/submit-paper",
      {
        method: "POST",
        credentials: "include",
        body: formData
      }
    );

    const responseData = response.json();
    console.log(responseData.data);
  } catch (error) {
    console.log(error);
  }
});