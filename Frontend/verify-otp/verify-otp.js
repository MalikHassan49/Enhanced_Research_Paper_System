
const inputs = document.querySelectorAll(".otp-input");
const buttons = document.querySelectorAll(".number-btn");
const backspaceBtn = document.querySelector(".backspace");

let currentIndex = 0;

// inputs box logic
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
      currentIndex = index + 1;
    }
  })
})

// Backspace logic(it only moves to previous index.Our browser actually deletes the value)
inputs.forEach((input, index) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && input.value === "" && index > 0) {
      inputs[index - 1].focus();
      currentIndex = index - 1;
    }
  })
})

// Number buttons logic
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (currentIndex < inputs.length) {
      inputs[currentIndex].value = button.innerText;
      // move next
      currentIndex++;
      if (currentIndex < inputs.length) {
        inputs[currentIndex].focus();
      }
    }
  })
});

// Backspace logic
backspaceBtn.addEventListener("click", () => {
  for (let i = inputs.length - 1; i >= 0; i--) {
    if (inputs[i].value !== "") {
      inputs[i].value = "";
      inputs[i].focus();
      currentIndex = i;
      break;
    }
  }
})

// Verify btn logic
const verifyBtn = document.querySelector(".verify-btn");

verifyBtn.addEventListener("click", async () => {
  let otp = "";

  inputs.forEach((input) => {
    otp += input.value;
  });
  console.log("OTP: ", otp);
  const email = localStorage.getItem("verifyEmail");
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/verify-otp`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email,
        otp
      }),
      credentials: "include"
    });

    const responseData = await response.json();
    if (response.ok) {
      localStorage.removeItem("verifyEmail");
      window.location.href = "../student-dashboard/studentDashboard.html";
    }
  } catch (error) {
    console.log("Error: ", error);
  }
});

// resend btn otp

const resendBtn = document.querySelector(".resend-btn");
const credentialsContainer = document.querySelector(".credentials-container");


resendBtn.addEventListener("click", async () => {
  const email = localStorage.getItem("verifyEmail");
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/resend-otp`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email
      })
    });

    const data = await response.json();
    console.log("Response Data: ", data);
    if (!response.ok) {
      resendBtn.disabled = true;
      let timeLeft = data.data.ttl;
      const timer = setInterval(() => {
        credentialsContainer.innerHTML = `
        <p class = "cooldown-otp">Wait for ${timeLeft}s before requesting another otp!</p>
        `
        timeLeft--;
        if (timeLeft < 0) {
          clearInterval(timer);
          credentialsContainer.innerHTML = "";
          resendBtn.disabled = false;
        }
      }, 1000)
      return;
    }

    if (response.ok) {
      setTimeout(() => {
        credentialsContainer.innerHTML = `
        <p class = "resend-otp">OTP resend successfully!</p>
        `
      }, 2000)
    }
  } catch (error) {
    console.log(error);
  }
});