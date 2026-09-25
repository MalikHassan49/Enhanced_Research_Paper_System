const params = new URLSearchParams(window.location.search);
const paperId = params.get("id") || "";
const paperTitle = params.get("title") ? decodeURIComponent(params.get("title")) : "";
const fileUrl = params.get("url") ? decodeURIComponent(params.get("url")) : "";

const backBtn = document.getElementById("back-btn");
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const userQuestionInput = document.getElementById("user-question");
const sendBtn = document.getElementById("send-btn");
const statusMessage = document.getElementById("status-message");
const paperTitleElement = document.getElementById("paper-title");

if (paperTitle) {
  paperTitleElement.textContent = paperTitle;
}

function showStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`.trim();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendMessage(sender, text, isError = false) {
  const messageWrap = document.createElement("div");
  messageWrap.classList.add("chat-message");

  if (sender === "user") {
    messageWrap.classList.add("user");
  } else {
    messageWrap.classList.add("assistant");
  }

  if (isError) {
    messageWrap.classList.add("error");
  }

  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");

  const senderLabel = document.createElement("strong");
  senderLabel.textContent = sender === "user" ? "You" : "Assistant";

  const messageText = document.createElement("p");
  messageText.textContent = text;

  bubble.appendChild(senderLabel);
  bubble.appendChild(messageText);
  messageWrap.appendChild(bubble);
  chatMessages.appendChild(messageWrap);
  scrollToBottom();
}

function appendLoadingIndicator() {
  const loadingWrap = document.createElement("div");
  loadingWrap.classList.add("chat-message", "assistant");

  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");

  const typing = document.createElement("div");
  typing.classList.add("typing-loader");
  typing.innerHTML = "<span></span><span></span><span></span>";

  const label = document.createElement("strong");
  label.textContent = "Assistant";

  bubble.appendChild(label);
  bubble.appendChild(typing);
  loadingWrap.appendChild(bubble);
  chatMessages.appendChild(loadingWrap);
  scrollToBottom();

  return loadingWrap;
}

function removeLoadingIndicator(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

backBtn.addEventListener("click", () => {
  if (paperId && fileUrl) {
    const paperUrl = `../view-paper/viewPaper.html?id=${paperId}&url=${encodeURIComponent(fileUrl)}${paperTitle ? `&title=${encodeURIComponent(paperTitle)}` : ""}`;
    window.location.href = paperUrl;
    return;
  }

  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.href = "../review-papers/reviewPapers.html";
});

if (!paperId) {
  showStatus("No paper was selected. Please return to the review page and try again.", "error");
  userQuestionInput.disabled = true;
  sendBtn.disabled = true;
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!paperId) {
    showStatus("Missing paper id. Please restart the chat from a valid paper page.", "error");
    return;
  }

  const question = userQuestionInput.value.trim();

  if (!question) {
    showStatus("Please enter a question before sending.", "error");
    userQuestionInput.focus();
    return;
  }

  appendMessage("user", question);
  userQuestionInput.value = "";
  const loadingIndicator = appendLoadingIndicator();
  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";
  showStatus("Thinking...", "info");

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/papers/${paperId}/rag-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ question })
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData?.message || "The request failed while fetching the answer.");
    }

    const answer = responseData?.data?.answer || "I could not find an answer for that question.";
    removeLoadingIndicator(loadingIndicator);
    appendMessage("assistant", answer);
    showStatus("", "");
  } catch (error) {
    removeLoadingIndicator(loadingIndicator);
    appendMessage("assistant", error.message || "Something went wrong while fetching the answer.", true);
    showStatus(error.message || "Something went wrong while fetching the answer.", "error");
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
    userQuestionInput.focus();
  }
});
