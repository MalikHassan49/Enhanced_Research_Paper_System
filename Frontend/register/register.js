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
const registerBtn = document.querySelector(".register-button");
let isRegistering = false;

const setRegisterLoading = (isLoading) => {
  isRegistering = isLoading;
  registerBtn.disabled = isLoading;
  registerBtn.setAttribute("aria-busy", String(isLoading));
  registerBtn.innerHTML = isLoading
    ? '<span class="button-spinner" aria-hidden="true"></span>'
    : 'Register <i class="fa-solid fa-arrow-right"></i>';
};

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (isRegistering) {
      return;
    }

    setRegisterLoading(true);
    document.querySelector(".credentials-container").innerHTML =
      "<p>Creating your account...</p>";

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
        localStorage.setItem("verifyEmail", email);
        // for smooth animate to studentDashboard
        document.body.classList.add("fade-out");
        window.location.href = "../verify-otp/verify-otp.html";
      }
      else {
        alert(responseData.message || "Registration Failed");
      }

    } catch (error) {
      console.log(error);
      const container = document.querySelector(".credentials-container");
      container.innerHTML = `<p>"Invalid credentials"</p>`
    } finally {
      setRegisterLoading(false);
    }
  })
}