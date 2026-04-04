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
  if (loginPassword.type === "password") {
    loginPassword.type = "text";
  }
  else {
    loginPassword.type = "password";
  }
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
  if (loginConfirmPassword.type === "password") {
    loginConfirmPassword.type = "text";
  }
  else {
    loginConfirmPassword.type = "password";
  }
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
  if (registerPassword.type === "password") {
    registerPassword.type = "text";
  }
  else {
    registerPassword.type = "password";
  }
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
  if (registerConfirmPassword.type === "password") {
    registerConfirmPassword.type = "text";
  }
  else {
    registerConfirmPassword.type = "password";
  }
});
}

// add event listener on register confirm lock password
if(registerConfirmLockPassword && registerConfirmPassword) {
  registerConfirmLockPassword.addEventListener("click", () => {
  registerConfirmPassword.disabled = !registerConfirmPassword.disabled;
})
};