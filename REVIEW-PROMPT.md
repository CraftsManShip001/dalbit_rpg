# Claude 코드 리뷰 프롬프트

## 사용법

Codex 구현 완료 후 Claude에게 아래 형식으로 요청:

```
[코드 리뷰 요청]

태스크: T05 — useGameEngine

검토 기준:
1. TypeScript strict 준수 (any 타입 없음, 타입 추론 명확)
2. useEffect cleanup 함수 누락 없음 (setInterval / setTimeout)
3. Zustand 스토어 액션 올바르게 호출하는지
4. 단일 책임 원칙 — 훅이 담당하지 않아야 할 로직 없는지
5. 달빛약속 도메인 로직 (문법, 인덱스 등) 실수 있는지

[파일 내용 붙여넣기]
```

---

## 리뷰 체크리스트 (태스크별)

### 공통 (모든 태스크)
- `any` 타입 없음
- `noUnusedLocals`, `noUnusedParameters` 위반 없음
- 인라인 `style={}` 없음 (PandaCSS만 사용)
- 컴포넌트 파일명 PascalCase, 훅 파일명 camelCase

### T02~T03 런타임 관련
- Worker `terminate()` 타임아웃 핸들러에서 반드시 호출
- 에러 타입 discriminated union (`'TIMEOUT' | 'RUNTIME_ERROR'`)
- Worker 생성 후 `onmessage`, `onerror` 핸들러 등록 순서

### T04~T05 상태/엔진
- `useEffect` 모든 의존성 배열 올바른지
- HP 0 미만 방어 로직
- `setInterval` cleanup 반드시 존재

### T06~T07 데이터/판정
- `Question` discriminated union 올바른지
- 따라치기 개행 normalize (`\r\n` → `\n`)
- 알고리즘 실패 시 `hpPenalty` effect 반환 (스토어 직접 호출 아님)
- 문제 데이터의 달빛약속 문법 정확성 (들여쓰기 4칸, 인덱스 1부터)

### T08~T12 UI
- `disabled` prop 올바르게 처리
- 애니메이션 CSS `@keyframes` 외부 라이브러리 최소화
- 모든 `key` prop 존재 (리스트 렌더링)
