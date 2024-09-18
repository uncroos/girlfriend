import os

# 특정 인물 대사 추출 함수
def extract_dialogue(file_path, character):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    character_dialogues = []
    is_character_speaking = False  # 인물이 대사를 말하고 있는지 여부 추적
    dialogue_block = []  # 현재 대사 블록

    # 파일의 각 줄을 처리
    for line in lines:
        # 해당 인물의 이름이 나오면 새로운 대사 시작
        if line.startswith(f'（{character}）'):
            if dialogue_block:  # 대사 블록이 있으면 저장
                character_dialogues.append("\n".join(dialogue_block))
            is_character_speaking = True
            dialogue_block = [line.strip()]  # 새로운 대사 블록 시작
        elif line.startswith('（') and is_character_speaking:
            # 다른 인물이 등장하면 대사 끝
            is_character_speaking = False
            character_dialogues.append("\n".join(dialogue_block))
            dialogue_block = []
        elif is_character_speaking:
            # 대사가 이어지면 대사 블록에 추가
            dialogue_block.append(line.strip())

    # 마지막 대사 블록 추가
    if dialogue_block:
        character_dialogues.append("\n".join(dialogue_block))

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
            file.write(dialogue + '\n\n')  # 각 대사 블록 사이에 빈 줄 추가

# 사용 예시
directory_path = 'data'  # 26개의 파일이 있는 디렉토리 경로
character = 'アスカ'
all_dialogues = extract_from_multiple_files(directory_path, character)

# 추출한 대사를 Asuka.txt 파일로 저장
output_file = 'Asuka.txt'
save_to_file(all_dialogues, output_file)

print(f"대사가 {output_file} 파일에 저장되었습니다.")
