const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const resetPasswordBtn = document.querySelector(".reset-password-btn");

if (password.value != confirmPassword.value) {
  alert("Password does'nt match");
}

resetPasswordBtn.addEventListener("click", async () => {
  const newPassword = password.value;
  const email = localStorage.getItem("verifyEmail");
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/reset-password`, {
      method: "POST",
      headers: {
        "Content-type" : "application/json"
      },
      body: JSON.stringify({
        email,
        newPassword
      })
    });

    const responseData = await response.json();
    if (response.ok) {
      localStorage.removeItem("verifyEmail");
      setTimeout(() => {
        window.location.href = "../password-reset-successfully/passwordResetSuccessfully.html";
      }, 1000)
    }
  } catch (error) {
    console.log("Error: ", error);
  }
})