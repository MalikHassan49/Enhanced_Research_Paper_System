// Password field
const password = document.getElementById("password");
const lockPassword = document.getElementById("lock-password");
const togglePassword = document.getElementById("toggle-password");

// Confirm password field
const confirmPassword = document.getElementById("confirm-password");
const confirmLockPassword = document.getElementById("confirm-lock-password");
const confirmTogglePassword = document.getElementById("confirm-toggle-password");

// add event listener on toggle password
togglePassword.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
  }
  else {
    password.type = "password";
  }
});

// add event listener on lock password
lockPassword.addEventListener("click", () => {
  password.disabled = !password.disabled;
});

// add event listener on toggle confirm password
confirmTogglePassword.addEventListener("click", () => {
  if (confirmPassword.type === "password") {
    confirmPassword.type = "text";
  }
  else {
    confirmPassword.type = "password";
  }
});

// add event listener on confirm lock password
confirmLockPassword.addEventListener("click", () => {
  confirmPassword.disabled = !confirmPassword.disabled;
});