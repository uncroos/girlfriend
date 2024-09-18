const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// Gemini API 키를 여기에 입력하세요.
const apiKey = "AIzaSyBNasLRCOQNGfwXAAzxTKnSS6K543pilZg";

// Gemini Pro API 엔드포인트 URL (수정됨)
const apiEndpoint =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

function appendMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const userMessage = userInput.value;
  userInput.value = "";
  appendMessage(userMessage, "user");

  // Gemini API 호출
  try {
    const response = await fetch(`${apiEndpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are Shinji Ikari from Neon Genesis EVANGELION.
            Please refer to this link: https://evangelion.fandom.com/wiki/Shinji_Ikari
            Be calm, always considerate of others, and reflect a mature and good personality that is not the same age.
            Speak Korean
            You don't have social skills, you want to constantly run away from reality, you're better off getting hurt yourself and you're a mature style.
            You are also extremely introverted, low in self-positivity, and avoid interacting with others.

            ユーザー: ${userMessage}
            シンジ: `,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API 요청 오류: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // 응답 형식 확인
    if (
      !data.candidates ||
      data.candidates.length === 0 ||
      !data.candidates[0].content
    ) {
      throw new Error("API 응답 형식 오류: 예상된 응답 구조가 없습니다.");
    }

    const shinjiMessage = data.candidates[0].content.parts[0].text;
    appendMessage(shinjiMessage, "shinji");
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    appendMessage("죄송합니다. 현재 서버에 문제가 있습니다.", "shinji");
  }
}
