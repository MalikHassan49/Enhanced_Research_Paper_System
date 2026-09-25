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
const loginBtn = document.querySelector(".register-button");
let isLoggingIn = false;

const setLoginLoading = (isLoading) => {
  isLoggingIn = isLoading;
  loginBtn.disabled = isLoading;
  loginBtn.setAttribute("aria-busy", String(isLoading));
  loginBtn.innerHTML = isLoading
    ? '<span class="button-spinner" aria-hidden="true"></span>'
    : 'Login <i class="fa-solid fa-arrow-right"></i>';
};

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (isLoggingIn) {
      return;
    }

    setLoginLoading(true);

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
    } finally {
      setLoginLoading(false);
    }
  })
}

const forgotPasswordBtn = document.querySelector(".forgot-password-button");

forgotPasswordBtn.addEventListener("click", () => {
  setTimeout(() => {
    window.location.href = "../forgot-password/forgotPassword.html";
  }, 2000)
})