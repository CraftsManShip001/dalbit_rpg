# T09 — YaksokEditor (CodeMirror 6)

## 사용한 에이전트 도구

- [x] Codex
- [x] Claude
- [x] antigravity
- [ ] 직접

## 에이전트에게 위임한 작업의 범위

- `YaksokEditor`를 CodeMirror 6 기반으로 구현
- 탭 입력 시 공백 4칸 강제
- controlled 패턴(`value`, `onChange`) 동기화
- `Compartment.reconfigure()`로 `disabled`, placeholder 동적 반영
- `Cmd-Enter`, `Ctrl-Enter`, `Mod-Enter` 실행 키맵 반영
- 외부 `focusTrigger` 변경 시 자동 포커스 반영

## 위임 판단 근거

CodeMirror는 생명주기/상태 동기화 포인트가 많아 수동 구현 시 누락 위험이 있다.
에이전트로 구조를 빠르게 구현하고, 실제 IME/키입력 동작을 브라우저에서 검증하는 방식이 효율적이었다.

## 에이전트 산출물 검증 방법

1. 입력 검증
- 한글 IME 조합 입력 정상 동작
- Tab 입력 시 4칸 스페이스 삽입

2. 실행 단축키 검증
- `Cmd/Ctrl + Enter`로 실행 동작 확인

3. 상태 전환 검증
- `disabled` 전환 즉시 반영
- 문제 전환 시 에디터 자동 포커스

4. 정적 검증
- `pnpm build` 통과

## 에이전트가 잘못된 방향을 제시했을 때 교정 방법

- 초기 테마 문서가 다크 기준이었지만 실제 디자인은 라이트 톤이므로 문서 설명을 현행 구현 기준으로 교정했다.
