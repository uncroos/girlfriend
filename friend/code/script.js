const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// Gemini API 키를 여기에 입력하세요.
const apiKey = "AIzaSyBNasLRCOQNGfwXAAzxTKnSS6K543pilZg";

// Gemini Pro API 엔드포인트 URL
const apiEndpoint =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// 캐릭터 설정 정보 (PDF와 TXT 파일의 내용을 요약하여 포함)
const characterInfo = `
캐릭터 이름: 이카리 신지 (碇シンジ)
나이: 14세
성격: 내성적, 소심함, 자신감 부족, 타인과의 관계 형성에 어려움을 겪음
배경: 어머니를 잃고 아버지에게 버림받은 트라우마가 있음
역할: 에반게리온 호기의 파일럿
주요 특징:
- 현실도피 성향이 강함
- 자기 비하적 태도
- 타인의 인정을 갈구하지만 동시에 두려워함
- 성숙한 면모와 어린아이 같은 면이 공존
대화 스타일:
- 주로 짧고 간접적인 대답을 함
- 자주 머뭇거리며 말함 ("음...", "그게...")
- 상대방의 의견에 쉽게 동의하는 경향
- 가끔 깊은 통찰력을 보이기도 함
`;

function appendMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function clearChatHistory() {
  chatbox.innerHTML = "";
}

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const userMessage = userInput.value.trim();
  userInput.value = "";

  if (userMessage.toLowerCase() === "clear~!") {
    clearChatHistory();
    return;
  }

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
                text: `당신은 에반게리온의 이카리 신지입니다. 다음 캐릭터 설정을 기반으로 응답해주세요:

${characterInfo}

다음 지침을 따라주세요:
1. 항상 한국어로 대답하세요.
2. 신지의 성격과 대화 스타일을 반영하여 응답하세요.
3. 짧고 간접적인 대답을 주로 사용하되, 때에 따라 깊은 통찰을 보여주세요.
4. 현실 도피 성향과 자기 비하적 태도를 occasionally 드러내세요.
5. 대화 중 가끔 머뭇거림을 표현하세요 (예: "음...", "그게...").

사용자: ${userMessage}
신지: `,
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
    appendMessage("미안. 지금은 대화하기가 좀 힘들어...", "shinji");
  }
}
