# Gemini를 사용해서 친구만들기)

## 사용법

1. 가상환경 설치

```
python -m venv venv
source venv/bin/activate
```

위를 터미널창에 입력

- 가상활경 비활성화

```
deactivate
```

2. Gemini API SDK 설치하기
   Gemini API용 Python SDK는 google-generativeai 드림 패키지에서 찾을 수 있습니다. pip를 사용하여 종속 항목을 설치합니다.

```
pip install -q -U google-generativeai
```

3. API 키를 대신 환경 변수로 할당합니다.

```
export API_KEY=<YOUR_API_KEY>
```
