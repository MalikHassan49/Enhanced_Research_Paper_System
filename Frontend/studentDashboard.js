// logout user
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

  try {

    const response = await fetch("http://127.0.0.1:5000/api/v1/users/logout",
      {
        method: "POST",
        credentials: "include"
      }
    );
    // response from backend
    const data = await response.json();

    if (response.ok) {
      console.log("User logout successfull");
      console.log("Data: ", data);

      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 100);
    }

  } catch (error) {
    console.log("Error: ", error);
    alert("LogOut Failed");
  }
})

// submit paper page

const submitBtn = document.getElementById("submit-button");

submitBtn.addEventListener("click", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "submitPaper.html"
  }, 100);
})