import MDEditor, { getCommands, ICommand } from '@uiw/react-markdown-editor'
import { EditorSelection } from '@codemirror/state'
import '@uiw/react-markdown-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import LaunchIcon from '@mui/icons-material/Launch'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import TitleIcon from '@mui/icons-material/Title'
import { Tooltip } from '@mui/material'

type Props = {
  markdown: string
  setMarkdown: (v: string) => void
}

const highlight: ICommand = {
  name: 'mark',
  keyCommand: 'mark',
  button: { 'aria-label': 'Add highlight' },
  icon: (
    <Tooltip title='High light(ハイライト)' placement='top'>
      <DriveFileRenameOutlineIcon />
    </Tooltip>
  ),
  execute: ({ state, view }) => {
    if (!state || !view) return
    view.dispatch(
      view.state.changeByRange(range => ({
        changes: [
          { from: range.from, insert: '<mark>' },
          { from: range.to, insert: '</mark>' }
        ],
        range: EditorSelection.range(range.from + 2, range.to + 2)
      }))
    )
  }
}

const button: ICommand = {
  name: 'button',
  keyCommand: 'button',
  button: { 'aria-label': 'Add button' },
  icon: (
    <Tooltip title='Button(ボタン)' placement='top'>
      <LaunchIcon />
    </Tooltip>
  ),
  execute: ({ state, view }) => {
    if (!state || !view) return
    if (!state || !view) return
    const main = view.state.selection.main
    const txt = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to)
    view.dispatch({
      changes: {
        from: main.from,
        to: main.to,
        insert: `<button>[${txt}]()</button>`
      },
      selection: EditorSelection.range(main.from + 3 + txt.length, main.to + 3)

      // selection: { anchor: main.from + 4 },
    })
  }
}

const bold: ICommand = {
  name: 'bold',
  keyCommand: 'bold',
  button: { 'aria-label': 'Add bold' },
  icon: (
    <Tooltip title='Bold(太字)' placement='top'>
      <FormatBoldIcon />
    </Tooltip>
  ),
  execute: ({ state, view }) => {
    if (!state || !view) return
    if (!state || !view) return
    const main = view.state.selection.main
    const txt = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to)
    view.dispatch({
      changes: {
        from: main.from,
        to: main.to,
        insert: `<strong>${txt}</strong>`
      },
      selection: EditorSelection.range(main.from + 3 + txt.length, main.to + 3)

      // selection: { anchor: main.from + 4 },
    })
  }
}

const br: ICommand = {
  name: 'br',
  keyCommand: 'br',
  button: { 'aria-label': 'Add br' },
  icon: (
    <Tooltip title='Return(改行)' placement='top'>
      <KeyboardReturnIcon />
    </Tooltip>
  ),
  execute: ({ state, view }) => {
    if (!state || !view) return
    if (!state || !view) return
    const main = view.state.selection.main
    const txt = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to)
    view.dispatch({
      changes: {
        from: main.from,
        to: main.to,
        insert: `${txt}<br>`
      },
      selection: EditorSelection.range(main.from + 3 + txt.length, main.to + 3)

      // selection: { anchor: main.from + 4 },
    })
  }
}

const h2: ICommand = {
  name: 'h2',
  keyCommand: 'h2',
  button: { 'aria-label': 'Add h2' },
  icon: (
    <Tooltip title='Sub Title(サブタイトル)' placement='top'>
      <TitleIcon />
    </Tooltip>
  ),
  execute: ({ state, view }) => {
    if (!state || !view) return
    if (!state || !view) return
    const main = view.state.selection.main
    const txt = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to)
    view.dispatch({
      changes: {
        from: main.from,
        to: main.to,
        insert: `<h2 id="${main.from}-${main.to}">${txt}</h2>\r\n`
      },
      selection: EditorSelection.range(main.from + 3 + txt.length, main.to + 3)

      // selection: { anchor: main.from + 4 },
    })
  }
}

const MdEditor = (props: Props) => {
  const commands = getCommands().filter(v => {
    return v.name != 'bold'
  })

  return (
    <div data-color-mode='light' style={{ zIndex: 99999 }}>
      <MDEditor
        value={props.markdown}
        onChange={value => {
          props.setMarkdown(value)
        }}
        toolbars={commands.concat([h2, br, highlight, button, bold])}
        maxHeight='800px'
        height={'600px'}
      />
    </div>
  )
}

export default MdEditor
