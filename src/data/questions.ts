export interface QuickQuestion {
  type: 'quick'
  prompt: string
  timeLimit: number
  expectedOutputs: string[]
  hint?: string
}

export interface CopyQuestion {
  type: 'copy'
  prompt: string
  codeToType: string
  timeLimit: number
}

export interface AlgorithmQuestion {
  type: 'algorithm'
  prompt: string
  timeLimit: number
  expectedOutputs: string[]
  hpPenalty: number
}

export type Question = QuickQuestion | CopyQuestion | AlgorithmQuestion

export interface StageQuestions {
  stage: number
  questions: Question[]
}

const outputLines = (value: string): string[] => value.split('\n')

const EXTENDED_QUICK_QUESTIONS: QuickQuestion[] = [
  { type: 'quick', prompt: '"안녕하세요" 를 출력하라', timeLimit: 15, expectedOutputs: ['안녕하세요'] },
  { type: 'quick', prompt: '"Hello, World!" 를 출력하라', timeLimit: 15, expectedOutputs: ['Hello, World!'] },
  { type: 'quick', prompt: '"이름: 홍길동" 을 출력하라', timeLimit: 15, expectedOutputs: ['이름: 홍길동'] },
  { type: 'quick', prompt: '"나이: 17" 을 출력하라', timeLimit: 15, expectedOutputs: ['나이: 17'] },
  { type: 'quick', prompt: '"오늘은 월요일입니다" 를 출력하라', timeLimit: 15, expectedOutputs: ['오늘은 월요일입니다'] },
  { type: 'quick', prompt: '"오늘도 좋은 하루!" 를 출력하라', timeLimit: 15, expectedOutputs: ['오늘도 좋은 하루!'] },

  { type: 'quick', prompt: '변수 나이에 25를 저장하고 출력하라', timeLimit: 15, expectedOutputs: ['25'] },
  { type: 'quick', prompt: '변수 이름에 "달빛" 을 저장하고 출력하라', timeLimit: 15, expectedOutputs: ['달빛'] },
  { type: 'quick', prompt: '변수 점수에 100을 저장하고 출력하라', timeLimit: 15, expectedOutputs: ['100'] },
  { type: 'quick', prompt: '변수 숫자에 42를 저장하고 출력하라', timeLimit: 15, expectedOutputs: ['42'] },
  { type: 'quick', prompt: '변수 과일에 "사과" 를 저장하고 출력하라', timeLimit: 15, expectedOutputs: ['사과'] },
  { type: 'quick', prompt: '나이 = 20, 내년나이 = 나이 + 1 로 내년나이를 출력하라', timeLimit: 15, expectedOutputs: ['21'] },
  { type: 'quick', prompt: '나이 = 17, 나이 + 1 을 출력하라', timeLimit: 15, expectedOutputs: ['18'] },
  { type: 'quick', prompt: '가격 = 1500, 개수 = 3 으로 가격 * 개수 를 출력하라', timeLimit: 15, expectedOutputs: ['4500'] },
  { type: 'quick', prompt: '총점 = 270, 과목수 = 3 으로 총점 / 과목수 를 출력하라', timeLimit: 15, expectedOutputs: ['90'] },

  { type: 'quick', prompt: '10 + 37 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['47'] },
  { type: 'quick', prompt: '100 - 42 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['58'] },
  { type: 'quick', prompt: '6 * 7 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['42'] },
  { type: 'quick', prompt: '100 / 4 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['25'] },
  { type: 'quick', prompt: '200 + 300 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['500'] },
  { type: 'quick', prompt: '1000 - 250 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['750'] },
  { type: 'quick', prompt: '12 * 12 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['144'] },
  { type: 'quick', prompt: '144 / 12 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['12'] },
  { type: 'quick', prompt: '7 * 8 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['56'] },
  { type: 'quick', prompt: '9 * 9 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['81'] },
  { type: 'quick', prompt: '123 + 456 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['579'] },
  { type: 'quick', prompt: '1000 * 1000 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['1000000'] },
  { type: 'quick', prompt: '10000 - 3500 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['6500'] },
  { type: 'quick', prompt: '75 / 3 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['25'] },
  { type: 'quick', prompt: '360 / 6 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['60'] },
  { type: 'quick', prompt: '(10 + 5) * 2 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['30'] },
  { type: 'quick', prompt: '(100 - 20) / 4 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['20'] },
  { type: 'quick', prompt: '(3 + 4) * (2 + 1) 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['21'] },

  { type: 'quick', prompt: '17 % 5 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['2'] },
  { type: 'quick', prompt: '17 // 5 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['3'] },
  { type: 'quick', prompt: '23 % 7 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['2'] },
  { type: 'quick', prompt: '50 // 7 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['7'] },
  { type: 'quick', prompt: '100 % 3 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['1'] },
  { type: 'quick', prompt: '100 // 3 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['33'] },
  { type: 'quick', prompt: '99 // 10 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['9'] },
  { type: 'quick', prompt: '99 % 10 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['9'] },
  { type: 'quick', prompt: '255 % 16 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['15'] },
  { type: 'quick', prompt: '255 // 16 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['15'] },
  { type: 'quick', prompt: '33 % 4 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['1'] },
  { type: 'quick', prompt: '33 // 4 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['8'] },
  { type: 'quick', prompt: '88 % 10 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['8'] },
  { type: 'quick', prompt: '2024 % 4 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['0'] },
  { type: 'quick', prompt: '999 % 10 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['9'] },

  { type: 'quick', prompt: '2 ** 8 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['256'] },
  { type: 'quick', prompt: '3 ** 3 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['27'] },
  { type: 'quick', prompt: '4 ** 4 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['256'] },
  { type: 'quick', prompt: '5 ** 5 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['3125'] },
  { type: 'quick', prompt: '(2 + 3) ** 2 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['25'] },
  { type: 'quick', prompt: '7 ** 2 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['49'] },
  { type: 'quick', prompt: '6 ** 2 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['36'] },
  { type: 'quick', prompt: '10 ** 3 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['1000'] },
  { type: 'quick', prompt: '2 ** 10 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['1024'] },
  { type: 'quick', prompt: '8 ** 3 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['512'] },

  { type: 'quick', prompt: '"안녕" 과 "하세요" 를 이어붙여 출력하라', timeLimit: 15, expectedOutputs: ['안녕하세요'] },
  { type: 'quick', prompt: '"달빛" 과 "약속" 을 이어붙여 출력하라', timeLimit: 15, expectedOutputs: ['달빛약속'] },
  { type: 'quick', prompt: '"안녕" + " " + "세상" 을 출력하라', timeLimit: 15, expectedOutputs: ['안녕 세상'] },
  { type: 'quick', prompt: '"Hello" + ", " + "World" + "!" 를 출력하라', timeLimit: 15, expectedOutputs: ['Hello, World!'] },
  { type: 'quick', prompt: '"이름: " + "홍길동" 을 출력하라', timeLimit: 15, expectedOutputs: ['이름: 홍길동'] },
  { type: 'quick', prompt: '"점수: " + "100" 을 출력하라', timeLimit: 15, expectedOutputs: ['점수: 100'] },
  { type: 'quick', prompt: '"홍" + "길" + "동" 을 출력하라', timeLimit: 15, expectedOutputs: ['홍길동'] },
  { type: 'quick', prompt: '"달빛" + " " + "약속" 을 출력하라', timeLimit: 15, expectedOutputs: ['달빛 약속'] },
  { type: 'quick', prompt: '이름 = "김철수", "안녕하세요, " + 이름 + "!" 를 출력하라', timeLimit: 15, expectedOutputs: ['안녕하세요, 김철수!'] },

  { type: 'quick', prompt: '"하하" * 3 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['하하하하하하'] },
  { type: 'quick', prompt: '"코딩" * 2 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['코딩코딩'] },
  { type: 'quick', prompt: '"*" * 5 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['*****'] },
  { type: 'quick', prompt: '"#" * 10 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['##########'] },
  { type: 'quick', prompt: '"=-" * 4 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['=-=-=-=-'] },
  { type: 'quick', prompt: '"ab" * 3 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['ababab'] },
  { type: 'quick', prompt: '"오" * 5 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['오오오오오'] },
  { type: 'quick', prompt: '"가" * 7 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['가가가가가가가'] },
  { type: 'quick', prompt: '"달빛" * 4 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['달빛달빛달빛달빛'] },
  { type: 'quick', prompt: '"!" * 3 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['!!!'] },
  { type: 'quick', prompt: '"?" * 8 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['????????'] },
  { type: 'quick', prompt: '"abc" * 4 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['abcabcabcabc'] },

  { type: 'quick', prompt: '폭 = 5, 높이 = 8 로 폭 * 높이 를 출력하라', timeLimit: 15, expectedOutputs: ['40'] },
  { type: 'quick', prompt: '너비 = 12, 높이 = 5 로 너비 * 높이 를 출력하라', timeLimit: 15, expectedOutputs: ['60'] },
  { type: 'quick', prompt: '사과 = 3, 배 = 5 로 사과 + 배 를 출력하라', timeLimit: 15, expectedOutputs: ['8'] },
  { type: 'quick', prompt: '반지름 = 5 로 반지름 * 반지름 * 3 을 출력하라', timeLimit: 15, expectedOutputs: ['75'] },
  { type: 'quick', prompt: '반지름 = 10 으로 반지름 ** 2 를 출력하라', timeLimit: 15, expectedOutputs: ['100'] },
  { type: 'quick', prompt: '밑변 = 4, 높이 = 6 으로 밑변 * 높이 / 2 를 출력하라', timeLimit: 15, expectedOutputs: ['12'] },
  { type: 'quick', prompt: '섭씨 = 0 일 때 화씨(섭씨 * 9 / 5 + 32)를 출력하라', timeLimit: 15, expectedOutputs: ['32'] },
  { type: 'quick', prompt: '섭씨 = 100 일 때 화씨(섭씨 * 9 / 5 + 32)를 출력하라', timeLimit: 15, expectedOutputs: ['212'] },
  { type: 'quick', prompt: '속도 = 60, 시간 = 3 으로 속도 * 시간 을 출력하라', timeLimit: 15, expectedOutputs: ['180'] },
  { type: 'quick', prompt: '원가 = 10000, 할인율 = 20 으로 원가 - 원가 * 할인율 / 100 을 출력하라', timeLimit: 15, expectedOutputs: ['8000'] },
  { type: 'quick', prompt: '365 * 24 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['8760'] },
  { type: 'quick', prompt: '60 * 60 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['3600'] },
  { type: 'quick', prompt: '1024 / 2 의 결과를 출력하라', timeLimit: 15, expectedOutputs: ['512'] },
  { type: 'quick', prompt: '가격 = 9900, 개수 = 5 로 가격 * 개수 를 출력하라', timeLimit: 15, expectedOutputs: ['49500'] },
  { type: 'quick', prompt: '합계 = 50 + 30 + 20 으로 합계를 출력하라', timeLimit: 15, expectedOutputs: ['100'] },
]

const EXTENDED_COPY_QUESTIONS: CopyQuestion[] = [
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '"안녕하세요" 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '"Hello, World!" 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '"달빛약속에 오신걸 환영합니다" 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '"오늘도 좋은 하루 되세요!" 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '"코딩은 즐거워!" 보여주기', timeLimit: 20 },

  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '나이 = 25\n나이 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '이름 = "달빛"\n이름 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '점수 = 100\n점수 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '사과 = 3\n배 = 5\n사과 + 배 보여주기', timeLimit: 25 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '가격 = 1500\n개수 = 3\n가격 * 개수 보여주기', timeLimit: 25 },

  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '10 + 37 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '6 * 7 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '17 % 5 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '2 ** 8 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '"하하" * 3 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '"안녕" + " " + "세상" 보여주기', timeLimit: 20 },

  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '점수 = 75\n만약 점수 >= 60 이면\n    "합격" 보여주기\n아니면\n    "불합격" 보여주기',
    timeLimit: 35,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: 'HP = 25\n만약 HP < 30 이면\n    "위험해!" 보여주기\n아니면\n    "괜찮아!" 보여주기',
    timeLimit: 35,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '나이 = 20\n만약 나이 >= 18 이면\n    "성인입니다" 보여주기\n아니면\n    "미성년자입니다" 보여주기',
    timeLimit: 35,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '숫자 = 7\n만약 숫자 % 2 == 0 이면\n    "짝수" 보여주기\n아니면\n    "홀수" 보여주기',
    timeLimit: 35,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '온도 = 35\n만약 온도 >= 30 이면\n    "더워요" 보여주기\n아니면 만약 온도 >= 20 이면\n    "선선해요" 보여주기\n아니면\n    "추워요" 보여주기',
    timeLimit: 45,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '점수 = 88\n만약 점수 >= 90 이면\n    "A" 보여주기\n아니면 만약 점수 >= 80 이면\n    "B" 보여주기\n아니면 만약 점수 >= 70 이면\n    "C" 보여주기\n아니면\n    "D" 보여주기',
    timeLimit: 50,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '수학 = 85\n영어 = 90\n만약 수학 >= 80 이고 영어 >= 80 이면\n    "우수" 보여주기\n아니면\n    "보통" 보여주기',
    timeLimit: 40,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '나이 = 15\n만약 나이 >= 18 이거나 나이 < 8 이면\n    "특별 관리 대상" 보여주기\n아니면\n    "일반 학생" 보여주기',
    timeLimit: 40,
  },

  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '3번 반복\n    "안녕!" 보여주기',
    timeLimit: 25,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '5번 반복\n    "달빛약속" 보여주기',
    timeLimit: 25,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '횟수 = 1\n반복\n    횟수 보여주기\n    횟수 = 횟수 + 1\n    만약 횟수 > 5 이면\n        반복 그만',
    timeLimit: 45,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '합계 = 0\n횟수 = 1\n반복\n    합계 = 합계 + 횟수\n    횟수 = 횟수 + 1\n    만약 횟수 > 10 이면\n        반복 그만\n합계 보여주기',
    timeLimit: 55,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '단 = 3\n횟수 = 1\n반복\n    단 * 횟수 보여주기\n    횟수 = 횟수 + 1\n    만약 횟수 > 9 이면\n        반복 그만',
    timeLimit: 50,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '과일들 = ["사과", "바나나", "딸기"]\n반복 과일들 의 항목 마다\n    항목 보여주기',
    timeLimit: 40,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '횟수 = 1\n반복\n    "*" * 횟수 보여주기\n    횟수 = 횟수 + 1\n    만약 횟수 > 5 이면\n        반복 그만',
    timeLimit: 45,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '숫자들 = [1, 2, 3, 4, 5]\n반복 숫자들 의 항목 마다\n    항목 보여주기',
    timeLimit: 35,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '횟수 = 1\n반복\n    만약 횟수 % 2 == 0 이면\n        횟수 보여주기\n    횟수 = 횟수 + 1\n    만약 횟수 > 10 이면\n        반복 그만',
    timeLimit: 50,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '숫자들 = [1, 2, 3, 4, 5]\n반복 숫자들 의 항목 마다\n    항목 * 2 보여주기',
    timeLimit: 35,
  },

  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '"달빛" + "약속" 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '"*" * 10 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '365 * 24 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '반지름 = 5\n반지름 * 반지름 * 3 보여주기', timeLimit: 25 },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '이름 = "홍길동"\n"안녕하세요, " + 이름 + "!" 보여주기',
    timeLimit: 30,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '밑변 = 4\n높이 = 6\n밑변 * 높이 / 2 보여주기',
    timeLimit: 30,
  },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '2 ** 10 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '100 // 3 보여주기', timeLimit: 20 },
  { type: 'copy', prompt: '아래 코드를 그대로 입력하세요', codeToType: '100 % 3 보여주기', timeLimit: 20 },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '폭 = 5\n높이 = 8\n폭 * 높이 보여주기',
    timeLimit: 25,
  },

  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '값 = 10\n만약 값 > 0 이면\n    "양수" 보여주기\n아니면 만약 값 < 0 이면\n    "음수" 보여주기\n아니면\n    "영" 보여주기',
    timeLimit: 45,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '키 = 175\n만약 키 >= 180 이면\n    "크다" 보여주기\n아니면 만약 키 >= 170 이면\n    "보통" 보여주기\n아니면\n    "작다" 보여주기',
    timeLimit: 45,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '수학 = 70\n영어 = 85\n만약 수학 >= 60 이고 영어 >= 60 이면\n    "전과목 합격" 보여주기\n아니면\n    "과락" 보여주기',
    timeLimit: 40,
  },

  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '합계 = 0\n횟수 = 1\n반복\n    만약 횟수 % 2 == 0 이면\n        합계 = 합계 + 횟수\n    횟수 = 횟수 + 1\n    만약 횟수 > 10 이면\n        반복 그만\n합계 보여주기',
    timeLimit: 60,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '숫자들 = [10, 20, 30, 40, 50]\n합계 = 0\n반복 숫자들 의 항목 마다\n    합계 = 합계 + 항목\n합계 보여주기',
    timeLimit: 45,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '횟수 = 5\n반복\n    횟수 보여주기\n    횟수 = 횟수 - 1\n    만약 횟수 < 1 이면\n        반복 그만',
    timeLimit: 40,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '단 = 5\n횟수 = 1\n반복\n    단 * 횟수 보여주기\n    횟수 = 횟수 + 1\n    만약 횟수 > 9 이면\n        반복 그만',
    timeLimit: 50,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '결과 = 1\n횟수 = 1\n반복\n    결과 = 결과 * 횟수\n    횟수 = 횟수 + 1\n    만약 횟수 > 5 이면\n        반복 그만\n결과 보여주기',
    timeLimit: 50,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '숫자들 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n반복 숫자들 의 항목 마다\n    만약 항목 % 2 == 0 이면\n        항목 보여주기',
    timeLimit: 50,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '최대 = 0\n숫자들 = [3, 7, 1, 9, 4]\n반복 숫자들 의 항목 마다\n    만약 항목 > 최대 이면\n        최대 = 항목\n최대 보여주기',
    timeLimit: 50,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '단어들 = ["달빛", "약속", "게임"]\n결과 = ""\n반복 단어들 의 항목 마다\n    결과 = 결과 + 항목\n결과 보여주기',
    timeLimit: 50,
  },
]

const ADDITIONAL_COPY_QUESTIONS: CopyQuestion[] = [
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '점수들 = [55, 72, 88, 43, 95, 60]\n반복 점수들 의 항목 마다\n    만약 항목 >= 60 이면\n        "합격" 보여주기\n    아니면\n        "불합격" 보여주기',
    timeLimit: 55,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '횟수 = 1\n반복\n    만약 횟수 % 2 == 1 이면\n        횟수 보여주기\n    횟수 = 횟수 + 1\n    만약 횟수 > 10 이면\n        반복 그만',
    timeLimit: 50,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '합계 = 0\n횟수 = 1\n반복\n    합계 = 합계 + 횟수\n    횟수 = 횟수 + 1\n    만약 횟수 > 100 이면\n        반복 그만\n합계 보여주기',
    timeLimit: 60,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '횟수 = 10\n반복\n    횟수 보여주기\n    횟수 = 횟수 - 1\n    만약 횟수 < 1 이면\n        반복 그만',
    timeLimit: 40,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '결과 = 1\n횟수 = 1\n반복\n    결과 = 결과 * 횟수\n    횟수 = 횟수 + 1\n    만약 횟수 > 6 이면\n        반복 그만\n결과 보여주기',
    timeLimit: 50,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '합계 = 0\n횟수 = 2\n반복\n    합계 = 합계 + 횟수\n    횟수 = 횟수 + 2\n    만약 횟수 > 20 이면\n        반복 그만\n합계 보여주기',
    timeLimit: 50,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '성적들 = [90, 75, 85, 95, 80]\n최대 = 0\n반복 성적들 의 항목 마다\n    만약 항목 > 최대 이면\n        최대 = 항목\n최대 보여주기',
    timeLimit: 55,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '횟수 = 3\n반복\n    횟수 보여주기\n    횟수 = 횟수 - 1\n    만약 횟수 < 1 이면\n        반복 그만\n"발사!" 보여주기',
    timeLimit: 40,
  },
  {
    type: 'copy',
    prompt: '아래 코드를 그대로 입력하세요',
    codeToType: '합계 = 0\n횟수 = 1\n반복\n    합계 = 합계 + 횟수\n    횟수 = 횟수 + 1\n    만약 횟수 > 50 이면\n        반복 그만\n합계 보여주기',
    timeLimit: 60,
  },
]

const STAGE_ONE_ALGORITHM_QUESTIONS: AlgorithmQuestion[] = [
  {
    type: 'algorithm',
    prompt: '반복문으로 1부터 10까지의 합을 출력하세요.',
    timeLimit: 40,
    expectedOutputs: ['55'],
    hpPenalty: 35,
  },
  {
    type: 'algorithm',
    prompt: '목록 [3, 1, 4, 1, 5]에서 가장 큰 수를 출력하세요.',
    timeLimit: 45,
    expectedOutputs: ['5'],
    hpPenalty: 35,
  },
  {
    type: 'algorithm',
    prompt: '구구단 3단의 결과를 3부터 27까지 한 줄씩 출력하세요.',
    timeLimit: 45,
    expectedOutputs: ['3', '6', '9', '12', '15', '18', '21', '24', '27'],
    hpPenalty: 35,
  },
]

const ADDITIONAL_ALGORITHM_QUESTIONS: AlgorithmQuestion[] = [
  {
    type: 'algorithm',
    prompt: '1부터 10까지의 합을 구하여 출력하라 (반복문 사용)',
    timeLimit: 60,
    expectedOutputs: ['55'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 5까지의 합을 구하여 출력하라 (반복문 사용)',
    timeLimit: 60,
    expectedOutputs: ['15'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 100까지의 합을 구하여 출력하라 (반복문 사용)',
    timeLimit: 60,
    expectedOutputs: ['5050'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 30까지의 합을 구하여 출력하라 (반복문 사용)',
    timeLimit: 60,
    expectedOutputs: ['465'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 50까지의 합을 구하여 출력하라 (반복문 사용)',
    timeLimit: 60,
    expectedOutputs: ['1275'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 10까지의 짝수만 더한 합을 출력하라',
    timeLimit: 60,
    expectedOutputs: ['30'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 9까지의 홀수만 더한 합을 출력하라',
    timeLimit: 60,
    expectedOutputs: ['25'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 20까지 짝수만 더한 합을 출력하라',
    timeLimit: 60,
    expectedOutputs: ['110'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [10, 20, 30, 40, 50] 의 모든 원소 합계를 출력하라',
    timeLimit: 60,
    expectedOutputs: ['150'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [85, 92, 78, 95, 88] 의 합계를 출력하라',
    timeLimit: 60,
    expectedOutputs: ['438'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [20, 30, 40, 50, 60] 의 합계와 평균을 각각 출력하라 (합계 먼저)',
    timeLimit: 60,
    expectedOutputs: ['200', '40'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [10, 20, 30, 40, 50] 의 평균을 출력하라',
    timeLimit: 60,
    expectedOutputs: ['30'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '구구단 5단의 곱셈 결과를 5×1부터 5×9까지 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('5\n10\n15\n20\n25\n30\n35\n40\n45'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '구구단 2단의 결과를 2×1부터 2×9까지 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('2\n4\n6\n8\n10\n12\n14\n16\n18'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '구구단 3단의 결과를 3×1부터 3×9까지 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('3\n6\n9\n12\n15\n18\n21\n24\n27'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '구구단 4단의 결과를 4×1부터 4×9까지 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('4\n8\n12\n16\n20\n24\n28\n32\n36'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '구구단 6단의 결과를 6×1부터 6×9까지 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('6\n12\n18\n24\n30\n36\n42\n48\n54'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '구구단 7단의 결과를 7×1부터 7×9까지 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('7\n14\n21\n28\n35\n42\n49\n56\n63'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '구구단 8단의 결과를 8×1부터 8×9까지 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('8\n16\n24\n32\n40\n48\n56\n64\n72'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '구구단 9단의 결과를 9×1부터 9×9까지 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('9\n18\n27\n36\n45\n54\n63\n72\n81'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 5까지 숫자를 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('1\n2\n3\n4\n5'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 10까지 숫자를 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('1\n2\n3\n4\n5\n6\n7\n8\n9\n10'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '0부터 9까지 숫자를 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('0\n1\n2\n3\n4\n5\n6\n7\n8\n9'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '5부터 1까지 카운트다운하여 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('5\n4\n3\n2\n1'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '10부터 1까지 역순으로 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('10\n9\n8\n7\n6\n5\n4\n3\n2\n1'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '3, 2, 1 카운트다운 후 "발사!" 를 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('3\n2\n1\n발사!'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 5까지 누적합을 매 단계마다 출력하라 (1, 3, 6, 10, 15)',
    timeLimit: 60,
    expectedOutputs: outputLines('1\n3\n6\n10\n15'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 10까지 중 짝수만 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('2\n4\n6\n8\n10'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 10까지 중 홀수만 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('1\n3\n5\n7\n9'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] 에서 짝수만 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('2\n4\n6\n8\n10'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] 에서 홀수만 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('1\n3\n5\n7\n9'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 20까지 중 짝수만 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('2\n4\n6\n8\n10\n12\n14\n16\n18\n20'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [4, 7, 2, 9, 6] 의 각 항목이 짝수면 "짝수", 홀수면 "홀수" 를 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('짝수\n홀수\n짝수\n홀수\n짝수'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 20까지 짝수의 개수를 출력하라',
    timeLimit: 60,
    expectedOutputs: ['10'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 20까지 3의 배수를 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('3\n6\n9\n12\n15\n18'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 15까지 3의 배수를 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('3\n6\n9\n12\n15'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '2부터 20까지 2의 배수를 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('2\n4\n6\n8\n10\n12\n14\n16\n18\n20'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '5부터 50까지 5의 배수를 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('5\n10\n15\n20\n25\n30\n35\n40\n45\n50'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '7부터 70까지 7의 배수를 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('7\n14\n21\n28\n35\n42\n49\n56\n63\n70'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 20까지 중 3의 배수가 아닌 수를 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('1\n2\n4\n5\n7\n8\n10\n11\n13\n14\n16\n17\n19\n20'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '별(*)을 1개, 2개, 3개 순서로 각 줄에 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('*\n**\n***'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '별(*)을 1개부터 5개까지 각 줄에 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('*\n**\n***\n****\n*****'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '별(*)을 1개부터 4개까지 각 줄에 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('*\n**\n***\n****'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '별(*)을 3개, 2개, 1개 순서로 역순으로 각 줄에 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('***\n**\n*'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '3! (팩토리얼) 을 계산하여 출력하라',
    timeLimit: 60,
    expectedOutputs: ['6'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '4! (팩토리얼) 을 계산하여 출력하라',
    timeLimit: 60,
    expectedOutputs: ['24'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '5! (팩토리얼) 을 계산하여 출력하라',
    timeLimit: 60,
    expectedOutputs: ['120'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '6! (팩토리얼) 을 계산하여 출력하라',
    timeLimit: 60,
    expectedOutputs: ['720'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '7! (팩토리얼) 을 계산하여 출력하라',
    timeLimit: 60,
    expectedOutputs: ['5040'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [3, 7, 1, 9, 4] 에서 가장 큰 수를 출력하라',
    timeLimit: 60,
    expectedOutputs: ['9'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [78, 92, 65, 88, 71] 에서 가장 큰 수를 출력하라',
    timeLimit: 60,
    expectedOutputs: ['92'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [90, 75, 85, 95, 80] 에서 가장 큰 수를 출력하라',
    timeLimit: 60,
    expectedOutputs: ['95'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [5, 2, 8, 1, 9, 3] 에서 가장 작은 수를 출력하라',
    timeLimit: 60,
    expectedOutputs: ['1'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [3, 7, 1, 9, 4, 2, 8] 의 원소 개수를 출력하라',
    timeLimit: 60,
    expectedOutputs: ['7'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [5, 12, 3, 18, 7, 15, 2] 에서 10 이상인 수만 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('12\n18\n15'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [55, 72, 88, 43, 95, 60] 에서 60점 이상이면 "합격", 미만이면 "불합격" 을 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('불합격\n합격\n합격\n불합격\n합격\n합격'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 [1, 2, 3, 4, 5] 의 각 원소를 2배 하여 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('2\n4\n6\n8\n10'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 10까지 각 숫자의 제곱을 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('1\n4\n9\n16\n25\n36\n49\n64\n81\n100'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '2의 거듭제곱을 1부터 시작하여 8번 출력하라 (1, 2, 4, 8, ...)',
    timeLimit: 60,
    expectedOutputs: outputLines('1\n2\n4\n8\n16\n32\n64\n128'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 ["달빛", "약속", "게임"] 의 항목을 이어붙인 결과를 출력하라',
    timeLimit: 60,
    expectedOutputs: ['달빛약속게임'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '목록 ["사과", "바나나", "딸기"] 의 각 항목을 한 줄씩 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('사과\n바나나\n딸기'),
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 5까지 숫자의 합계를 출력하라 (5번 반복 사용)',
    timeLimit: 60,
    expectedOutputs: ['15'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '구구단 5단의 합계를 출력하라 (5+10+15+...+45)',
    timeLimit: 60,
    expectedOutputs: ['225'],
    hpPenalty: 30,
  },
  {
    type: 'algorithm',
    prompt: '1부터 10까지 숫자를 반복문으로 출력하되, 5번 반복을 사용하여 1~5를 출력하라',
    timeLimit: 60,
    expectedOutputs: outputLines('1\n2\n3\n4\n5'),
    hpPenalty: 30,
  },
]

export const STAGE_QUESTIONS: StageQuestions[] = [
  {
    stage: 1,
    questions: [
      ...EXTENDED_QUICK_QUESTIONS,
      ...EXTENDED_COPY_QUESTIONS,
      ...ADDITIONAL_COPY_QUESTIONS,
      ...STAGE_ONE_ALGORITHM_QUESTIONS,
      ...ADDITIONAL_ALGORITHM_QUESTIONS,
    ],
  },
  {
    stage: 2,
    questions: [
      {
        type: 'quick',
        prompt: '(12 + 8) * 3 계산 결과를 출력하세요.',
        timeLimit: 10,
        expectedOutputs: ['60'],
      },
      {
        type: 'quick',
        prompt: '84 % 9 계산 결과를 출력하세요.',
        timeLimit: 10,
        expectedOutputs: ['3'],
      },
      {
        type: 'quick',
        prompt: '"달" + "빛" + " 전사" 결과를 출력하세요.',
        timeLimit: 10,
        expectedOutputs: ['달빛 전사'],
      },
      {
        type: 'copy',
        prompt: '아래 코드를 그대로 따라 치세요.',
        timeLimit: 30,
        codeToType: `횟수 = 1
반복
    만약 횟수 > 3 이면
        반복 그만
    "방어!" 보여주기
    횟수 += 1`,
      },
      {
        type: 'copy',
        prompt: '아래 코드를 그대로 따라 치세요.',
        timeLimit: 28,
        codeToType: `체력 = 45
만약 체력 >= 50 이면
    "안전" 보여주기
아니면
    "위험" 보여주기`,
      },
      {
        type: 'copy',
        prompt: '아래 코드를 그대로 따라 치세요.',
        timeLimit: 20,
        codeToType: `이름 = "달빛"
칭호 = "기사"
이름 + " " + 칭호 보여주기`,
      },
      {
        type: 'algorithm',
        prompt: '2부터 10까지 짝수의 합을 출력하세요.',
        timeLimit: 45,
        expectedOutputs: ['30'],
        hpPenalty: 45,
      },
      {
        type: 'algorithm',
        prompt: '1부터 5까지 곱한 값을 출력하세요.',
        timeLimit: 45,
        expectedOutputs: ['120'],
        hpPenalty: 45,
      },
      {
        type: 'algorithm',
        prompt: '"슬라임1 처치"부터 "슬라임4 처치"까지 한 줄씩 출력하세요.',
        timeLimit: 45,
        expectedOutputs: [
          '슬라임1 처치',
          '슬라임2 처치',
          '슬라임3 처치',
          '슬라임4 처치',
        ],
        hpPenalty: 45,
      },
    ],
  },
]
