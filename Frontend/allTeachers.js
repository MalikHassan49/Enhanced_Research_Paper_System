// back to teacher dashboard
const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "admin.html";
  }, 200)
})

async function allTeachers() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/users/all-teachers", {
      method: "GET",
      credentials: "include"
    });

    const responseData = await response.json();
    console.log("Resposne Data: ", responseData);

    const container = document.querySelector(".teachers-container");

    if (responseData.data.length > 0) {
      container.style.display = "flex";

      responseData.data.forEach(teacher => {
        const card = document.createElement("div");
        card.classList.add("teacher-container");

        card.innerHTML += `
    <p class="username">${teacher.username}</p>
    <p class="email">${teacher.email}</p>
    <p class="role">${teacher.role}</p>
    <button class="delete-btn" data-id = "${teacher._id}">Delete</button>
    `
        container.appendChild(card);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

allTeachers();

// delete teacher

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const teacherId = e.target.dataset.id;
    const card = e.target.closest(".teacher-container");

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/v1/users/${teacherId}/delete-teacher`, {
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