import { Compartment, EditorState, type Extension } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { EditorView, keymap, placeholder as editorPlaceholder } from '@codemirror/view'
import { useEffect, useRef } from 'react'
import { css } from '../../../styled-system/css'

interface YaksokEditorProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  disabled?: boolean
  placeholder?: string
  focusTrigger?: number
}

const tabKeymap = keymap.of([
  {
    key: 'Tab',
    run: (view) => {
      view.dispatch(view.state.replaceSelection('    '))
      return true
    },
  },
  ...defaultKeymap,
  ...historyKeymap,
])

const dalbitTheme = EditorView.theme({
  '&': {
    height: '100%',
    minHeight: '0',
    color: '#111111',
    backgroundColor: '#ECECEC',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '17px',
    lineHeight: '1.55',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-scroller': {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
  '.cm-content': {
    padding: '14px',
    minHeight: '100%',
    caretColor: '#111111',
  },
  '.cm-gutters': {
    backgroundColor: '#ECECEC',
    color: '#8A8A8A',
    border: 'none',
  },
  '.cm-activeLine': {
    backgroundColor: '#E3E3E3',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#E3E3E3',
    color: '#555555',
  },
  '.cm-cursor': {
    borderLeftColor: '#111111',
  },
  '.cm-placeholder': {
    color: '#8A8A8A',
    fontStyle: 'normal',
  },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
    backgroundColor: '#CFCDFC',
  },
})

function toPlaceholderExtension(text?: string): Extension {
  return text ? editorPlaceholder(text) : []
}

export default function YaksokEditor({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder,
  focusTrigger = 0,
}: YaksokEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<EditorView | null>(null)
  const editableCompartmentRef = useRef(new Compartment())
  const placeholderCompartmentRef = useRef(new Compartment())
  const onChangeRef = useRef(onChange)
  const onSubmitRef = useRef(onSubmit)
  const disabledRef = useRef(disabled)
  const initialValueRef = useRef(value)
  const initialDisabledRef = useRef(disabled)
  const initialPlaceholderRef = useRef(placeholder)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    onSubmitRef.current = onSubmit
  }, [onSubmit])

  useEffect(() => {
    disabledRef.current = disabled
  }, [disabled])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const state = EditorState.create({
      doc: initialValueRef.current,
      extensions: [
        history(),
        tabKeymap,
        keymap.of([
          {
            key: 'Cmd-Enter',
            run: () => {
              if (disabledRef.current) {
                return true
              }

              const submit = onSubmitRef.current
              if (!submit) {
                return false
              }

              submit()
              return true
            },
          },
          {
            key: 'Ctrl-Enter',
            run: () => {
              if (disabledRef.current) {
                return true
              }

              const submit = onSubmitRef.current
              if (!submit) {
                return false
              }

              submit()
              return true
            },
          },
          {
            key: 'Mod-Enter',
            run: () => {
              if (disabledRef.current) {
                return true
              }

              const submit = onSubmitRef.current
              if (!submit) {
                return false
              }

              submit()
              return true
            },
          },
        ]),
        dalbitTheme,
        EditorView.domEventHandlers({
          keydown: (event) => {
            if (event.isComposing) {
              return false
            }

            const isModPressed = event.metaKey || event.ctrlKey
            const isEnterPressed =
              event.key === 'Enter' || event.code === 'Enter' || event.code === 'NumpadEnter'

            if (!isModPressed || !isEnterPressed || disabledRef.current) {
              return false
            }

            const submit = onSubmitRef.current
            if (!submit) {
              return false
            }

            event.preventDefault()
            submit()
            return true
          },
        }),
        EditorView.contentAttributes.of({ 'aria-label': '달빛약속 코드 입력' }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString())
          }
        }),
        editableCompartmentRef.current.of(EditorView.editable.of(!initialDisabledRef.current)),
        placeholderCompartmentRef.current.of(
          toPlaceholderExtension(initialPlaceholderRef.current),
        ),
      ],
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [])

  useEffect(() => {
    const view = viewRef.current
    if (!view) {
      return
    }

    const currentValue = view.state.doc.toString()
    if (currentValue === value) {
      return
    }

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: value,
      },
    })
  }, [value])

  useEffect(() => {
    const view = viewRef.current
    if (!view) {
      return
    }

    view.dispatch({
      effects: [
        editableCompartmentRef.current.reconfigure(EditorView.editable.of(!disabled)),
        placeholderCompartmentRef.current.reconfigure(toPlaceholderExtension(placeholder)),
      ],
    })
  }, [disabled, placeholder])

  useEffect(() => {
    const view = viewRef.current
    if (!view || disabled) {
      return
    }

    const rafId = window.requestAnimationFrame(() => {
      view.focus()
    })

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [disabled, focusTrigger])

  return (
    <div
      className={css({
        flex: 1,
        h: { base: '280px', md: '100%' },
        minH: { base: '220px', md: '180px' },
        borderWidth: '3px',
        borderColor: disabled ? '#B9B6F7' : '#6A67EB',
        borderRadius: 'sm',
        overflow: 'hidden',
        bg: '#ECECEC',
        opacity: disabled ? '0.6' : '1',
        transitionDuration: 'fast',
      })}
      data-disabled={disabled}
    >
      <div ref={containerRef} />
    </div>
  )
}
