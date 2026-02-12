import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "min-h-[200px] p-4 prose prose-sm max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-[#333] rounded-lg overflow-hidden bg-white">
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-2 text-sm">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnStyle(editor.isActive("bold"))}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnStyle(editor.isActive("italic"))}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnStyle(editor.isActive("bulletList"))}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnStyle(editor.isActive("orderedList"))}
        >
          1. List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={btnStyle(false)}
        >
          Undo
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={btnStyle(false)}
        >
          Redo
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function btnStyle(active) {
  return `px-3 py-1 rounded-md transition ${
    active ? "bg-indigo-600 text-white" : "bg-white border hover:bg-gray-100"
  }`;
}
