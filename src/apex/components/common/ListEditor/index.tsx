import React from "react";
import ReactDOM from "react-dom";
import '../../../static/frontend/content/ListEditor1.css'

export function randomId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

type ButtonProps = { 
  [k: string]: any
}

export  function AddButton(props: ButtonProps) {
  return (
    <button className="add-button" {...props}>
      <span >Add</span>
    </button>
  )
}

export const notesAppActions = {
  toggleAddNewEditor: 'TOGGLE_ADD_NEW_EDITOR',
  toggleEditor: 'TOGGLE_EDITOR',
  addNewNote: 'ADD_NEW_NOTE',
  updateNote: 'UPDATE_NOTE',
  deleteNote: 'DELETE_NOTE',
}

export type NotesType = {
  id?: string
  note: string
}

type AppState = {
  notes: NotesType[]
  isAddNewEditorShowing: boolean
  currentEditingIndex: number
}

type AppActions = {
  type: string
  payload: {
    [k: string]: any
  }
}

// Returns a formatted Note object with a unique id.
function Note({ id, note }: NotesType) {
  return {
    id: id || randomId(),
    note,
  }
}

const initialState: AppState = {
  notes: [],
  isAddNewEditorShowing: false,
  currentEditingIndex: -1,
}

const reducer = (state: AppState, action: AppActions) => {
  switch (action.type) {
    case notesAppActions.toggleAddNewEditor:
      return {
        ...state,
        isAddNewEditorShowing: true,
        currentEditingIndex: action.payload.editorId,
      }
    case notesAppActions.toggleEditor:
      return {
        ...state,
        isAddNewEditorShowing: false,
        currentEditingIndex: action.payload.editorId,
      }
    case notesAppActions.addNewNote:
      return {
        ...state,
        notes: [
          ...state.notes,
          Note({
            note: action.payload.note,
          }),
        ],
        currentEditingIndex: -1,
        isAddNewEditorShowing: false,
      }
    case notesAppActions.updateNote: {
      const notes = state.notes.map(note => {
        if (note.id === action.payload.id) {
          note = Note({
            id: action.payload.id,
            note: action.payload.note,
          })
        }
        return note
      })

      return {
        ...state,
        notes,
        currentEditingIndex: -1,
        isAddNewEditorShowing: false,
      }
    }
    case notesAppActions.deleteNote: {
      const notes = state.notes.filter(note => note.id !== action.payload.id)

      return {
        ...state,
        notes,
        currentEditingIndex: -1,
        isAddNewEditorShowing: false,
      }
    }

    default:
      throw new Error(`No case for type ${action.type} found.`)
  }
}

export default function NotesApp() {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  React.useEffect(() => {
    console.log('state', state)
  })

  // Recursively map through each child; if the child has a displayName
  // of 'Editor', we'll add appropriate props to the component.
  const mapPropsToChildren = (children: React.ReactNode) => {
    let indexOfComponent = 0
    const recursiveMap = (child: React.ReactNode): any => {
      return React.Children.map(child, child => {
        if (!React.isValidElement(child)) {
          return child
        }
        // @ts-ignore
        if (child.type.displayName === 'Editor') {
          child = React.cloneElement(child, {
            // @ts-ignore
            index: indexOfComponent,
            isInEditingMode: indexOfComponent === state.currentEditingIndex,
            dispatch,
          })

          indexOfComponent++
          return child
        }

        // @ts-ignore
        if (child.props.children) {
          child = React.cloneElement(child, {
            // @ts-ignore
            children: recursiveMap(child.props.children),
          })
        }

        return child
      })
    }

    return recursiveMap(children)
  }

  return mapPropsToChildren(
    <>
      <div className="container">
        <ul className="editor-container">
          {state.notes.map(note => (
            <li key={note.id}>
              <Editor note={note} />
            </li>
          ))}
        </ul>
        {state.isAddNewEditorShowing && <Editor />}
        <AddButton
          disabled={state.isAddNewEditorShowing}
          onClick={() => {
            dispatch({
              type: notesAppActions.toggleAddNewEditor,
              payload: {
                editorId: state.notes.length,
              },
            })
          }}
        />
      </div>
    </>
  )
}


type EditorProps = {
  isInEditingMode?: boolean
  note?: NotesType
  [k: string]: any
}

export  function Editor(props: EditorProps) {
  const { index, isInEditingMode, dispatch, note, ...rest } = props

  const [text, setText] = React.useState(note ? note.note : '')

  const textarea = React.useRef<HTMLTextAreaElement>(null)
  React.useEffect(() => {
    if (isInEditingMode) {
      if (textarea && textarea.current) {
        textarea.current.focus()
      }
    }
  }, [isInEditingMode])

  return (
    <div {...rest} className="editor">
      {isInEditingMode ? (
        <>
          <Textarea className="edittext"
            ref={textarea}
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const { value } = e.target

              setText(value)
            }}
            placeholder="Add a thought..."
          />
          <div className="actions">
            <button
              className="cancel-btn"
              onClick={() => {
                dispatch({
                  type: notesAppActions.toggleEditor,
                  payload: {
                    editorId: -1,
                  },
                })
              }}
            >
              Cancel
            </button>
            <button
              className="save-btn"
              disabled={text.trim().length === 0}
              onClick={() => {
                // If note exists, send an edit action
                if (note) {
                  dispatch({
                    type: notesAppActions.updateNote,
                    payload: {
                      id: note.id,
                      note: text.trim(),
                    },
                  })
                } else {
                  dispatch({
                    type: notesAppActions.addNewNote,
                    payload: { note: text.trim() },
                  })
                }
              }}
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="">{note && note.note}</p>
          <div className="actions actions--left">
            <button
              className="edit-btn"
              onClick={() => {
                dispatch({
                  type: notesAppActions.toggleEditor,
                  payload: {
                    editorId: index,
                  },
                })
              }}
            >
              Edit
            </button>
            <WithConfirmation>
              {({ isConfirming, toggleConfirm }) => (
                <div className="delete-btn-container">
                  <button
                    className={`edit-btn${isConfirming ? ' btn-red' : ''}`}
                    onClick={() => {
                      if (!isConfirming) {
                        toggleConfirm(true)
                        return
                      }

                      if (note) {
                        dispatch({
                          type: notesAppActions.deleteNote,
                          payload: { id: note.id },
                        })
                      }
                    }}
                  >
                    {isConfirming ? 'Confirm?' : 'Delete'}
                  </button>
                  {isConfirming && (
                    <button
                      className="exit-icon-btn"
                      onClick={() => toggleConfirm(false)}
                    >
                      Exit
                    </button>
                  )}
                </div>
              )}
            </WithConfirmation>
          </div>
        </>
      )}
    </div>
  )
}

Editor.displayName = 'Editor'

/**
 * A Textarea that dynamically adjusts input
 * height based on the height of the content.
 */
const Textarea = React.forwardRef((props: any, ref: any) => {
  const { onChange, ...rest } = props

  const handleResize = React.useMemo(
    () => () => {
      if (ref.current) {
        ref.current.style.height = 'auto'
        ref.current.style.height =
          ref.current.offsetHeight <= ref.current.scrollHeight
            ? ref.current.scrollHeight + 'px'
            : '80px'
      }
    },
    [ref]
  )

  React.useLayoutEffect(() => {
    handleResize()
  }, [handleResize])

  return (
    <textarea
      ref={ref}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e)
        handleResize()
      }}
      {...rest}
    />
  )
})


export  function WithConfirmation({
  children,
}: {
  children: ({
    isConfirming,
    toggleConfirm,
  }: {
    isConfirming: boolean
    toggleConfirm: React.Dispatch<React.SetStateAction<boolean>>
  }) => React.ReactNode
}) {
  const [isConfirming, toggleConfirm] = React.useState(false)

  return (
    <>
      {children({
        isConfirming,
        toggleConfirm,
      })}
    </>
  )
}


const wrapper = document.getElementById("app2");

wrapper ? ReactDOM.render(<NotesApp />, wrapper) : null; 
