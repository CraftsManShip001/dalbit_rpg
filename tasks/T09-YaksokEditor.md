# T09 — YaksokEditor (CodeMirror 6)

## 전제 파일 (T08 완료)

- `src/components/game/YaksokEditor.tsx` 빈 스텁 존재, 이 태스크에서 구현
- BattlePage에서 `value={code}`, `onChange={setCode}` props로 사용 예정
- CodeMirror 6 패키지 설치 필요: `pnpm add @codemirror/view @codemirror/state @codemirror/commands`

## 목표

달빛약속 코드 입력용 CodeMirror 6 에디터 컴포넌트를 구현한다.
한글 IME 입력이 핵심 검증 항목이다.

## Props 인터페이스

```ts
interface YaksokEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}
```

## 구현 요구사항

- CodeMirror 6 (`@codemirror/view`, `@codemirror/state`, `@codemirror/commands`) 사용
- 달빛약속 전용 language mode 없음 → plain text mode 사용
- 탭 키 → 4칸 스페이스 삽입 (`indentWithTab` 아닌 커스텀 키바인딩)
- `disabled === true` → `EditorView.editable.of(false)` + 시각적 잠금 표시 (opacity 낮춤)
- 어두운 배경 테마 (RPG 던전 분위기)
- PandaCSS로 외부 래퍼 스타일, 에디터 내부는 CodeMirror 기본 스타일

### 탭 → 4칸 스페이스 키바인딩

```ts
import { keymap } from '@codemirror/view'
import { insertTab } from '@codemirror/commands'

// 탭을 4칸 스페이스로 치환
const tabKeymap = keymap.of([{
  key: 'Tab',
  run: (view) => {
    // 선택 없을 때: 커서 위치에 '    ' 삽입
    const spaces = '    '
    view.dispatch(view.state.replaceSelection(spaces))
    return true
  }
}])
```

### Controlled 에디터 패턴

```ts
// 외부 value prop 변경 시 에디터 내용 동기화
useEffect(() => {
  if (editorView && editorView.state.doc.toString() !== value) {
    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: value }
    })
  }
}, [value, editorView])
```

## 완료 기준

- [ ] 한글 입력 — 조합 중 깨짐 없음 (`가`, `각`, `강` 순서 입력)
- [ ] 탭 키 → 4칸 스페이스 삽입
- [ ] `disabled={true}` → 입력 불가, 시각적으로 잠긴 표시
- [ ] `onChange` — 입력할 때마다 호출
- [ ] 어두운 배경 테마 적용
- [ ] TypeScript 컴파일 에러 없음

## Claude 코드 리뷰 체크리스트

- `useEffect` cleanup에서 `editorView.destroy()` 호출하는가
- controlled 패턴 — `value` prop 변경 시 에디터 내용 동기화하는가
- `disabled` 변경 시 `EditorView.reconfigure()` 또는 재생성으로 반영하는가
- `any` 타입 없는가

## antigravity 브라우저 테스트

```
[ ] 한글 조합 입력 — "가나다" 입력 시 깨짐 없음
[ ] 탭 키 → 4칸 스페이스 (탭 문자 아님)
[ ] disabled 상태 — 클릭/입력 불가
[ ] onChange 콜백 — 콘솔에서 value 변화 확인
[ ] 1280px / 768px 에디터 레이아웃 정상
```
