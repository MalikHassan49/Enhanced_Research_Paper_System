// back to teacher dashboard
const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.addEventListener("click", () => {
  document.body.classList.add('fade-out');

  setTimeout(() => {
    window.location.href = "../admin/admin.html";
  }, 200)
})

async function allTeachers() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/all-teachers`, {
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
        <div class="row">
      <span>Name: </span>
      <span class="username" contenteditable="false">${teacher.username}</span>
     </div>
     <div class="row">
      <span>Email: </span>
      <span class="email" contenteditable="false">${teacher.email}</span>
     </div>
     <div class="row">
      <span>Role: </span>
      <span>Teacher</span>
     </div>
     <div class="credentials-container">
        <p></p>
     </div>
      <div class="btns-container">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn" data-id=${teacher._id}>Delete</button>
        <button class="save-btn" data-id=${teacher._id}>Save</button>
        <button class="cancel-btn">Cancel</button>
      </div>
    `
        container.appendChild(card);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

allTeachers();

// event delegation
document.addEventListener("click", (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const card = e.target.closest('.teacher-container');

    const username = card.querySelector('.username');
    const email = card.querySelector('.email');
    const saveBtn = card.querySelector('.save-btn');
    const cancelBtn = card.querySelector('.cancel-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    // save old username and email
    card.dataset.oldUsername = username.innerText.trim();
    card.dataset.oldEmail = email.innerText.trim();

    username.contentEditable = "true";
    email.contentEditable = "true";

    username.focus();
    // To select all the text
    const range = document.createRange();
    range.selectNodeContents(username);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);


    // email.focus();
    username.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();  // line break ko rokne ke liye
        email.focus();
        const range = document.createRange();
        range.selectNodeContents(email);

        const selOne = window.getSelection();
        selOne.removeAllRanges();
        selOne.addRange(range);
      }
    })

    saveBtn.style.display = "block";
    cancelBtn.style.display = "block";

    e.target.style.display = "none";
    deleteBtn.style.display = "none";

  }
})

// save button hit
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("save-btn")) {

    const card = e.target.closest(".teacher-container");
    const username = card.querySelector(".username").innerText.trim();
    const email = card.querySelector(".email").innerText.trim();

    const saveBtn = card.querySelector('.save-btn');
    const cancelBtn = card.querySelector('.cancel-btn');
    const editBtn = card.querySelector('.edit-btn');
    const deleteBtn = card.querySelector('.delete-btn');

    const teacherId = e.target.dataset.id;
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/${teacherId}/update-teacher`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          email
        })
      })

      const responseData = await response.json();
      console.log("Response Data: ", responseData);
      if (!response.ok) {
        console.log("Response not ok");
        // card.querySelector(".credentials-container").style.display = "block";
        card.querySelector(".credentials-container p").innerText = responseData.message;
        setTimeout(() => {
          card.querySelector(".credentials-container").innerHTML = "";
        }, 3000)
        return;
      }
      saveBtn.style.display = "none";
      cancelBtn.style.display = "none";
      editBtn.style.display = "block";
      deleteBtn.style.display = "block";
    } catch (error) {
      console.log("Error: ", error);
    }
  }

})

// cancel button
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("cancel-btn")) {
    const card = e.target.closest(".teacher-container");
    const username = card.querySelector(".username");
    const email = card.querySelector(".email");

    username.innerText = card.dataset.oldUsername;
    email.innerText = card.dataset.oldEmail;

    // reset the content
    username.contentEditable = "false";
    email.contentEditable = "false";
    // reset the buttons
    card.querySelector(".save-btn").style.display = "none";
    card.querySelector(".cancel-btn").style.display = "none";
    card.querySelector(".edit-btn").style.display = "block";
    card.querySelector(".delete-btn").style.display = "block";
  }
})

// delete button hit
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const teacherId = e.target.dataset.id;
    const card = e.target.closest(".teacher-container");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/${teacherId}/delete-teacher`, {
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