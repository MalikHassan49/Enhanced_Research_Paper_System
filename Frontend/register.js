// Register Password field
const registerPassword = document.getElementById("register-password");
const registerLockPassword = document.getElementById("register-lock-password");
const registerTogglePassword = document.getElementById("register-toggle-password");

// Register confirm password field
const registerConfirmPassword = document.getElementById("register-confirm-password");
const registerConfirmLockPassword = document.getElementById("register-confirm-lock-password");
const registerConfirmTogglePassword = document.getElementById("register-toggle-confirm-password");


// add event listener on register toggle password
if (registerTogglePassword && registerPassword) {
  registerTogglePassword.addEventListener("click", () => {
    registerPassword.type = registerPassword.type === "password" ? "text" : "password";
  });
}

// add event listener on register lock password
if (registerLockPassword && registerPassword) {
  registerLockPassword.addEventListener("click", () => {
    registerPassword.disabled = !registerPassword.disabled;
  });
}

// add event listener on register toggle confirm password
if (registerConfirmTogglePassword && registerConfirmPassword) {
  registerConfirmTogglePassword.addEventListener("click", () => {
    registerConfirmPassword.type = registerConfirmPassword.type === "password" ? "text" : "password";
  });
}

// add event listener on register confirm lock password
if (registerConfirmLockPassword && registerConfirmPassword) {
  registerConfirmLockPassword.addEventListener("click", () => {
    registerConfirmPassword.disabled = !registerConfirmPassword.disabled;
  })
};

// Registration Form

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;
    const role = document.getElementById("Roles").value;

    // simple validation
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/users/register", {
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

      const data = await response.json();

      if (response.ok) {
        console.log("User register successfully");
        console.log("Response data: ", data);
        // for smooth animate to authorDashboard
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = "authorDashboard.html";
        }, 100)
      }
      else {
        alert(data.message || "Registration Failed");
      }

    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  })
}