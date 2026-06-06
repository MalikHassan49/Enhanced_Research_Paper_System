// Register Password field
const registerPassword = document.getElementById("register-password");
const registerLockPassword = document.getElementById("register-lock-password");
const registerTogglePassword = document.getElementById("register-toggle-password");


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


// Registration Form

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const role = document.getElementById("Roles").value;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          email,
          password,
          role
        })
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log("Response data: ", responseData);
        localStorage.setItem("verifyEmail", email);
        // for smooth animate to studentDashboard
        document.body.classList.add("fade-out");
        setTimeout(() => {
            window.location.href = "../verify-otp/verify-otp.html";
        }, 1000)
      }
      else {
        alert(data.message || "Registration Failed");
      }

    } catch (error) {
      console.log(error);
      const container = document.querySelector(".credentials-container");
      container.innerHTML = `<p>"Invalid credentials"</p>`
    }
  })
}