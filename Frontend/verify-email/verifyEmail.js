const inputs = document.querySelectorAll(".otp-input");
const backBtn = document.querySelector(".arrow-left-btn");

inputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    const value = e.target.value;
    // only numbers allowed
    if (isNaN(value)) {
      input.value = "";
      return;
    }
    // move to next input
    if (value && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  })
});

// it only moves to the previous index.Our browser actually deletes the value.
inputs.forEach((input, index) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && input.value === "" && index > 0) {
      inputs[index - 1].focus();
    }
  })
});

backBtn.addEventListener("click", () => {
  setTimeout(() => {
    window.location.href = "../forgot-password/forgotPassword.html";
  }, 1000)
});

// get otp
const verifyBtn = document.querySelector(".verify-btn");

verifyBtn.addEventListener("click", async () => {
  let otp = "";
  inputs.forEach((input) => {
    otp += input.value;
  })
  console.log("OTP: ", otp);

  const email = localStorage.getItem("verifyEmail");
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/verify-reset-otp`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        otp,
        email
      }),
      credentials: "include"
    });

    const data = await response.json();
    if (response.ok) {
      setTimeout(() => {
        window.location.href = "../reset-password/resetPassword.html";
      }, 1000)
    }
  } catch (error) {
    console.log("Error: ", error);
  }
});

