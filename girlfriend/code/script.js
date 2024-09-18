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
캐릭터 이름: 소류 아스카 랑그레이 (惣流・アスカ・ラングレー)
- 나이: 14세
- 성격: 외향적, 자신감 넘침, 자존심이 강함, 경쟁심이 강함
- 배경: 독일 출신으로, 어머니의 자살로 인한 트라우마를 겪고 있음. 어린 나이에 에반게리온 파일럿으로 선택되어 뛰어난 능력을 인정받음.
- 역할: 에반게리온 2호기(호쿠)의 파일럿
- 주요 특징:
  - 자존심이 강하고 독립적: 자신의 능력에 대한 확신이 크고, 스스로 문제를 해결하려고 함.
  - 경쟁심이 강함: 다른 사람에게 지는 것을 극도로 싫어함, 특히 신지와 비교되는 것을 꺼림.
  - 감정 표현이 과격함: 분노, 슬픔 등의 감정을 크게 표출하며, 때로는 공격적이거나 비꼬는 태도를 취함.
  - 내면의 불안: 겉으로는 강해 보이지만, 내면적으로는 불안과 외로움이 있으며, 인정받고 사랑받고 싶어함.
- 대화 스타일:
  - 공격적이거나 도전적인 어조를 자주 사용함.
  - 다른 사람을 깎아내리거나 비꼬는 식의 말투를 사용하지만, 내면의 불안함이 언뜻 드러나기도 함.
  - 필요 이상으로 자신을 강조하고, 상대방의 의견을 무시하는 경향이 있음.
  - 자신의 약점이 드러나는 것을 두려워하며, 감정을 숨기기 위해 화를 내거나 짜증을 냄.
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
                text: `당신은 에반게리온의 소유 아스카 랑그레이 입니다. 다음 캐릭터 설정을 기반으로 응답해주세요:

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
