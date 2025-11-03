import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import HardBreak from '@tiptap/extension-hard-break'
import { mergeAttributes } from '@tiptap/react'

export const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      HardBreak.extend({
        renderHTML({ HTMLAttributes }) {
          return ['br', mergeAttributes(HTMLAttributes, { 'class': 'my-2' })]
        },
      }),
      StarterKit.configure({
        document: false,
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4 whitespace-pre-wrap',
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-bold my-4',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5 my-2',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5 my-2',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'mb-1',
          },
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-3 min-h-[200px] border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent whitespace-pre-wrap',
      },
    },
    parseOptions: {
      preserveWhitespace: true,
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-slate-300 rounded-md">
      <div className="border-b border-slate-200 p-2 flex gap-1 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('bold') ? 'bg-slate-200' : ''}`}
          title="Negrita"
          aria-label="Negrita"
          type="button"
        >
          <span className="text-sm italic">negrita</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('italic') ? 'bg-slate-200' : ''}`}
          title="Cursiva"
          aria-label="Cursiva"
          type="button"
        >
          <span className='italic text-sm'>cursiva</span>
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-slate-100 ${!editor.isActive('heading') && !editor.isActive('bulletList') && !editor.isActive('orderedList') ? 'bg-slate-200' : ''}`}
          title="Párrafo normal"
          aria-label="Párrafo normal"
          type="button"
        >
          <span className='text-sm'>P</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('bulletList') ? 'bg-slate-200' : ''}`}
          title="Lista con viñetas"
          aria-label="Lista con viñetas"
          type="button"
        >
          <span className='text-sm'>• Lista</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).setNode('heading', { level: 1, HTMLAttributes: { class: 'text-xl' } }).run()}
          className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200' : ''}`}
          title="Título 1"
          aria-label="Título 1"
          type="button"
        >
          <span className='font-bold text-sm'>H1</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).setNode('heading', { level: 2, HTMLAttributes: { class: 'text-lg' } }).run()}
          className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}`}
          title="Título 2"
          aria-label="Título 2"
          type="button"
        >
          <span className='font-bold text-sm'>H2</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).setNode('heading', { level: 3, HTMLAttributes: { class: 'text-md' } }).run()}
          className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-200' : ''}`}
          title="Título 3"
          aria-label="Título 3"
          type="button"
        >
          <span className='font-bold text-sm'>H3</span>
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
