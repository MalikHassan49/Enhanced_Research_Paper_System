const addTeacher = document.getElementById("add-teacher-btn");

addTeacher.addEventListener("click", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "addTeacher.html";
  }, 100)
})

// All teachers

const allTeachers = document.getElementById("all-teachers");

allTeachers.addEventListener("click", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "allTeachers.html";
  }, 100)
})


// All students

const allStudents = document.getElementById("all-students");

allStudents.addEventListener("click", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "allStudents.html";
  }, 100)
})

// All papers

const allPapers = document.getElementById("all-papers");

allPapers.addEventListener("click", () => {
  document.body.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "allPapers.html";
  }, 100)
})


// logout user
const logoutBtn = document.getElementById("logout-btn");

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
    alert("Logout Failed");
  }
})

// papers status count

async function papersStatus() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/papers/papers-status", {
      method : "GET",
      credentials : "include"
    });

    const responseData = await response.json();
    console.log("Response Data: ", responseData);
    if (responseData.data) {
      const statusContainer = document.querySelector(".papers-status-container");
      statusContainer.style.display = "block";
      statusContainer.innerHTML = `
      <p><span class="remove-mobile">Total</span> Accepted Papers: ${responseData.data?.acceptedPapers || 0}</p>
      <p><span class="remove-mobile">Total</span> Rejected Papers: ${responseData.data?.rejectedPapers || 0}</p>
      <p><span class="remove-mobile">Total</span> Pending Papers: ${responseData.data?.pendingPapers || 0}</p>
      <p><span class="remove-mobile">Total</span> Under Review Papers: ${responseData.data?.underReviewPapers || 0}</p>
      `
    }
  } catch (error) {
    console.log(error);
  }
}

papersStatus();