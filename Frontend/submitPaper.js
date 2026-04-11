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