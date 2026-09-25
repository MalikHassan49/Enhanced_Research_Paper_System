console.log("Forgot password js load");

const userEmail = document.getElementById("userEmail");
const sendBtn = document.querySelector(".send-btn");
let isSendingCode = false;

const setSendCodeLoading = (isLoading) => {
  isSendingCode = isLoading;
  sendBtn.disabled = isLoading;
  sendBtn.setAttribute("aria-busy", String(isLoading));
  sendBtn.innerHTML = isLoading
    ? '<span class="button-spinner" aria-hidden="true"></span>'
    : "Send Code";
};

sendBtn.addEventListener("click", async () => {
  if (isSendingCode) {
    return;
  }

  const email = userEmail.value.trim();
  if (!email) {
    return;
  }

  setSendCodeLoading(true);

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
      window.location.href = "../verify-email/verifyEmail.html";
    }
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    setSendCodeLoading(false);
  }
})

const signInBtn = document.querySelector(".arrow-left-btn");

signInBtn.addEventListener("click", async () => {
  setTimeout(() => {
    window.location.href = "../login/login.html";
  }, 1000)
})