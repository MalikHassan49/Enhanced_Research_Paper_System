// get current user

async function getCurrentUser() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/users/getCurrentUser", {
      method: "GET",
      credentials: "include"
    });

    const responseData = await response.json();
    if (responseData.data) {
      const logoutSectionContainer = document.querySelector(".logout-section");

      logoutSectionContainer.innerHTML = `
  <p>Welcome, ${responseData.data.username}!</p>
  <button id="logoutBtn">LOGOUT</button>
`
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
              window.location.href = "../login/login.html";
            }, 100);
          }

        } catch (error) {
          console.log("Error: ", error);
          alert("LogOut Failed");
        }
      })
    }
  } catch (error) {
    console.log(error);
  }
}

getCurrentUser();


const reviewBtn = document.getElementById("review-btn");

reviewBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "../review-papers/reviewPapers.html";
  }, 100)
})

// view all papers that teacher had reviewed

const viewPaperBtn = document.getElementById("view-papers");

viewPaperBtn.addEventListener("click", async () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "../reviewed-papers/reviewedPapers.html";
  }, 100)
})