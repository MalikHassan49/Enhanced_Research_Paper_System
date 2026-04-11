// Login Password field
const loginPassword = document.getElementById("login-password");
const loginLockPassword = document.getElementById("login-lock-password");
const loginTogglePassword = document.getElementById("login-toggle-password");

// Login confirm password field
const loginConfirmPassword = document.getElementById("login-confirm-password");
const loginConfirmLockPassword = document.getElementById("login-confirm-lock-password");
const loginConfirmTogglePassword = document.getElementById("login-toggle-confirm-password");

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

// add event listener on login toggle confirm password
if (loginConfirmTogglePassword && loginConfirmPassword) {
  loginConfirmTogglePassword.addEventListener("click", () => {
    loginConfirmPassword.type = loginConfirmPassword.type === "password" ? "text" : "password";
  });
}

// add event listener on login confirm lock password
if (loginConfirmLockPassword && loginConfirmPassword) {
  loginConfirmLockPassword.addEventListener("click", () => {
    loginConfirmPassword.disabled = !loginConfirmPassword.disabled;
  });
}

// Login form submit
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const role = document.getElementById("Roles").value;

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/users/login", {
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
          window.location.href = "authorDashboard.html";
        }, 100);
      }
    }
    catch (error) {
      console.log(error);
      alert("Server error");
    }
  })
}