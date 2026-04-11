// Login Password field
const loginPassword = document.getElementById("login-password");
const loginLockPassword = document.getElementById("login-lock-password");
const loginTogglePassword = document.getElementById("login-toggle-password");

// Login confirm password field
const loginConfirmPassword = document.getElementById("login-confirm-password");
const loginConfirmLockPassword = document.getElementById("login-confirm-lock-password");
const loginConfirmTogglePassword = document.getElementById("login-toggle-confirm-password");

// Register Password field
const registerPassword = document.getElementById("register-password");
const registerLockPassword = document.getElementById("register-lock-password");
const registerTogglePassword = document.getElementById("register-toggle-password");

// Register confirm password field
const registerConfirmPassword = document.getElementById("register-confirm-password");
const registerConfirmLockPassword = document.getElementById("register-confirm-lock-password");
const registerConfirmTogglePassword = document.getElementById("register-toggle-confirm-password");

// add event listener on login toggle password
if(loginTogglePassword && loginPassword) {
  loginTogglePassword.addEventListener("click", () => {
    loginPassword.type = loginPassword.type === "password" ? "text" : "password";
});
}

// add event listener on login lock password
if(loginLockPassword && loginPassword) {
  loginLockPassword.addEventListener("click", () => {
  loginPassword.disabled = !loginPassword.disabled;
});
}

// add event listener on login toggle confirm password
if(loginConfirmTogglePassword && loginConfirmPassword) {
  loginConfirmTogglePassword.addEventListener("click", () => {
    loginConfirmPassword.type = loginConfirmPassword.type === "password" ? "text" : "password";
});
}

// add event listener on login confirm lock password
if(loginConfirmLockPassword && loginConfirmPassword) {
  loginConfirmLockPassword.addEventListener("click", () => {
  loginConfirmPassword.disabled = !loginConfirmPassword.disabled;
});
}


// add event listener on register toggle password
if(registerTogglePassword && registerPassword) {
  registerTogglePassword.addEventListener("click", () => {
    registerPassword.type = registerPassword.type === "password" ? "text" : "password";
});
}

// add event listener on register lock password
if(registerLockPassword && registerPassword) {
  registerLockPassword.addEventListener("click", () => {
  registerPassword.disabled = !registerPassword.disabled;
});
}

// add event listener on register toggle confirm password
if(registerConfirmTogglePassword && registerConfirmPassword) {
  registerConfirmTogglePassword.addEventListener("click", () => {
    registerConfirmPassword.type = registerConfirmPassword.type === "password" ? "text" : "password";
});
}

// add event listener on register confirm lock password
if(registerConfirmLockPassword && registerConfirmPassword) {
  registerConfirmLockPassword.addEventListener("click", () => {
  registerConfirmPassword.disabled = !registerConfirmPassword.disabled;
})
};

// Registration Form

const registerForm = document.getElementById("registerForm");

if(registerForm) {
  registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("register-confirm-password").value;
  const role = document.getElementById("Roles").value;

  // simple validation
  if(password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/v1/users/register", {
      method: "POST", 
      headers: {
        "Content-Type" : "application/json"
      }, 
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
        role
      })
    });

    const data = await response.json();

    if(response.ok) {
      alert("User register successfully");
      console.log("Response data: ", data);
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

// Login form submit
const loginForm = document.getElementById("loginForm");

if(loginForm) {
  loginForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const role = document.getElementById("Roles").value;

    try {
      const response = await fetch("http://localhost:5000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
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

      if(response.ok) {
        alert("User Login successfull");
        console.log(data);
      }
    } 
    catch (error) {
      console.log(error);
      alert("Server error");
    }
  })
}

// submitPaper.html (Files temporary store in browser code)

const fileUpload = document.getElementById("fileUpload");
const fileText = document.getElementById("fileText");

fileUpload.addEventListener("change", () => {
  console.log("File data: ", fileUpload.files);
  console.log("First File data: ", fileUpload.files[0]);

  if(fileUpload.files.length > 0) {
    fileText.textContent = fileUpload.files[0].name;
  }
  
});