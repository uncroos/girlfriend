import os

# 특정 인물 대사 추출 함수
def extract_dialogue(file_path, character):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    character_dialogues = []
    is_character_speaking = False  # 인물이 대사를 말하고 있는지 여부 추적

    # 파일의 각 줄을 처리
    for line in lines:
        # 해당 인물의 이름이 나오면 대사 시작
        if line.startswith(f'（{character}）'):
            is_character_speaking = True
            character_dialogues.append(line.strip())  # 인물 이름 추가
        elif is_character_speaking:
            # 빈 줄이 나오면 대사 끝으로 간주
            if line.strip() == "":
                is_character_speaking = False
            else:
                # 대사가 계속 이어지면 추가
                character_dialogues.append(line.strip())

    return character_dialogues

# 디렉토리 내 모든 파일에서 대사를 추출하는 함수
def extract_from_multiple_files(directory_path, character):
    all_dialogues = []

    # 디렉토리 내 모든 파일을 순차적으로 처리
    for filename in os.listdir(directory_path):
        if filename.endswith(".txt"):
            file_path = os.path.join(directory_path, filename)
            dialogues = extract_dialogue(file_path, character)
            all_dialogues.extend(dialogues)
    
    return all_dialogues

# 대사를 파일에 저장하는 함수
def save_to_file(dialogues, output_file):
    with open(output_file, 'w', encoding='utf-8') as file:
        for dialogue in dialogues:
            file.write(dialogue + '\n')

# 사용 예시
directory_path = 'data'  # 26개의 파일이 있는 디렉토리 경로
character = 'シンジ'
all_dialogues = extract_from_multiple_files(directory_path, character)

# 추출한 대사를 Shinji.txt 파일로 저장
output_file = 'Shinji.txt'
save_to_file(all_dialogues, output_file)

print(f"대사가 {output_file} 파일에 저장되었습니다.")
