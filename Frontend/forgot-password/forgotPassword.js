console.log("Forgot password js load");

const userEmail = document.getElementById("userEmail");
const sendBtn = document.querySelector(".send-btn");

sendBtn.addEventListener("click", async () => {
  const email = userEmail.value.trim();
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email
      })
    });

    const responseData = await response.json();
    if (response.ok) {
      localStorage.setItem("verifyEmail", email);
      setTimeout(() => {
        window.location.href = "../verify-email/verifyEmail.html";
      }, 2000)
    }
  } catch (error) {
    console.log("Error: ", error);
  }
})

const signInBtn = document.querySelector(".arrow-left-btn");

signInBtn.addEventListener("click", async () => {
  setTimeout(() => {
    window.location.href = "../login/login.html";
  }, 1000)
})