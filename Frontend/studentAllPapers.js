const paperStatus = document.getElementById("status");
const paperTitle = document.getElementById("paper-title");
const paperAbstract = document.getElementById("paper-abstract");
const fileName = document.getElementsByName("file-name");

async function fetchPapersData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/papers/student-papers",
      {
        method: "GET",
        credentials: "include"
      }
    )

    const data = response.json();
    console.log(data);
    if (data.length > 0) {
      paperTitle.textContent = data.paperTitle;
      paperAbstract.textContent = data.paperAbstract;
      fileName.textContent = data.file.filename;
      paperStatus.textContent = data.status;
      document.querySelector(".papers-container").style.display = "flex";
    }
    else {
      document.querySelector(".papers-available-container").style.display = "block";
    }
  } catch (error) {
    console.log(error);
  }
}
