// back to teacher dashboard
const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "admin.html";
  }, 200)
})

async function allStudents () {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/users/all-students", {
      method: "GET",
      credentials: "include"
    });

    const responseData = await response.json();
    console.log("Resposne Data: ", responseData);

    const container = document.querySelector(".students-container");

    if (responseData.data.length > 0) {
      container.style.display = "flex";

      responseData.data.forEach(student => {
        const card = document.createElement("div");
        card.classList.add("student-container");

        card.innerHTML += `
    <p class="username">${student.username}</p>
    <p class="email">${student.email}</p>
    <p class="role">${student.role}</p>
    <button class="delete-btn" data-id = "${student._id}">Delete</button>
    `
        container.appendChild(card);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

allStudents();

// delete student

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const studentId = e.target.dataset.id;
    const card = e.target.closest(".student-container");

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/v1/users/${studentId}/delete-student`, {
        method: "DELETE",
        credentials: "include"
      });

      const responseData = await response.json();
      
      console.log(responseData);

      if (response.ok) {
        card.style.opacity = "0";
        setTimeout(() => {
          card.remove();
        }, 300)
      }
    } catch (error) {
      console.log(error);
    }
  }
})