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
      const response = await fetch("http://127.0.0.1:5000/api/v1/users/register", {
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

      const data = await response.json();

      if (response.ok) {
        console.log("User register successfully");
        console.log("Response data: ", data);
        // for smooth animate to studentDashboard
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = "studentDashboard.html";
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