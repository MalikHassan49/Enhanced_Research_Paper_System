// Login Password field
const loginPassword = document.getElementById("login-password");
const loginLockPassword = document.getElementById("login-lock-password");
const loginTogglePassword = document.getElementById("login-toggle-password");


// add event listener on login toggle password
if (loginTogglePassword && loginPassword) {
  loginTogglePassword.addEventListener("click", () => {
    loginPassword.type = loginPassword.type === "password" ? "text" : "password";
  });
}

// add event listener on login lock password
if (loginLockPassword && loginPassword) {
  loginLockPassword.addEventListener("click", () => {
    loginPassword.disabled = !loginPassword.disabled;
  });
}

// Login form submit
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // const username = document.getElementById("login-username").value;
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const role = document.getElementById("Roles").value;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          role
        })
      });
      // response from backend
      const data = await response.json();

      if (response.ok) {
        console.log("User Login successfull");
        console.log(data);

        document.body.classList.add("fade-out");

        setTimeout(() => {
          if (role === "Student") {
            window.location.href = "../student-dashboard/studentDashboard.html";
          }
          else if (role === "Teacher") {
            window.location.href = "../teacher-dashboard/teacherDashboard.html";
          }
          else if (role === "Admin") {
            window.location.href = "../admin/admin.html";
          }
        }, 100);
      }
    }
    catch (error) {
      console.log(error);
      const container = document.querySelector(".credentials-container");
      container.innerHTML = `<p>Invalid email or password</p>`
    }
  })
}