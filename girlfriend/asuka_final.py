# Shinji.txt에서 빈 줄과 '(シンジ)'를 제거하는 코드

# 원본 파일 이름과 결과 파일 이름을 설정
input_file = 'asuka_cleaned.txt'
output_file = 'asuka_cleaned_real.pdf'

# 파일을 읽고 '(シンジ)'와 빈 줄이 아닌 줄만 필터링하여 새 파일로 저장
with open(input_file, 'r', encoding='utf-8') as infile:
    lines = infile.readlines()

# '(シンジ)' 제거 및 빈 줄 제거
cleaned_lines = [line.replace('（シンジ）', '').strip() for line in lines if line.strip()]

# 결과를 새 파일에 기록
with open(output_file, 'w', encoding='utf-8') as outfile:
    outfile.writelines("\n".join(cleaned_lines) + "\n")

print(f"{output_file}에 '(シンジ)'와 빈 줄이 제거된 결과가 저장되었습니다.")
