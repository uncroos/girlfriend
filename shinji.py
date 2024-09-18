import os

# 특정 인물 대사 추출 함수
def extract_dialogue(file_path, character):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    # 추출할 대사를 저장할 리스트
    character_dialogues = []
    
    # 대사 앞에 특정 인물의 이름이 있는 줄을 추출
    for line in lines:
        if line.startswith(f'（{character}）'):
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
directory_path = 'data'
character = 'シンジ'
all_dialogues = extract_from_multiple_files(directory_path, character)

# 추출한 대사를 Shinji.txt 파일로 저장
output_file = 'Shinji.txt'
save_to_file(all_dialogues, output_file)

print(f"대사가 {output_file} 파일에 저장되었습니다.")
