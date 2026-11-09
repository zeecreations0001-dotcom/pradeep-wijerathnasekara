/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Undo,
  Redo,
  Minus,
  Loader2,
} from 'lucide-react';
import { processImageFile } from '../../services/imageService';
import { NewsroomStore } from '../../services/adminStore';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  editable = true,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-red-700 underline underline-offset-2 hover:text-red-900',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md shadow-sm my-4 max-w-full h-auto',
        },
      }),
    ],
    content: content || '<p></p>',
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync when props change externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p></p>');
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="border border-stone-300 rounded p-4 min-h-[220px] bg-stone-50 animate-pulse text-stone-400 text-sm">
        Initializing newsroom rich text editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter hyperlink URL:', previousUrl || 'https://');
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImageUrl = () => {
    const url = window.prompt(
      'Enter image URL (Unsplash, CDN or media library URL):',
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000'
    );
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Upload an image file from the user's computer/device
  const handleDeviceImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);
    try {
      const processed = await processImageFile(file, 1600, 1200, 0.85);

      // Insert into editor at cursor
      editor.chain().focus().setImage({
        src: processed.dataUrl,
        alt: processed.name,
        title: processed.name,
      }).run();

      // Automatically catalog in Media Library
      NewsroomStore.saveMedia({
        id: 'med-' + Date.now(),
        url: processed.dataUrl,
        name: processed.name,
        size: processed.size,
        type: 'image',
        credit: 'Staff Reporter Upload',
        caption: processed.name.replace(/\.[^/.]+$/, ''),
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Editorial Desk',
        dimensions: `${processed.width}x${processed.height}`,
      });
    } catch (err) {
      console.error('Failed to upload device image to article:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleDeviceImageUpload(file);
    }
  };

  // Handle drag-and-drop of image files directly into the editor
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        e.stopPropagation();
        handleDeviceImageUpload(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border border-stone-300 rounded-md overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-red-600/20 focus-within:border-red-600 transition-all relative"
    >
      {/* Hidden file input for device upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-stone-100 border-b border-stone-200 text-stone-700">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded text-xs font-semibold hover:bg-stone-200 transition ${
            editor.isActive('bold') ? 'bg-stone-300 text-stone-900' : ''
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded text-xs hover:bg-stone-200 transition ${
            editor.isActive('italic') ? 'bg-stone-300 text-stone-900' : ''
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded text-xs font-serif font-bold hover:bg-stone-200 transition ${
            editor.isActive('heading', { level: 1 }) ? 'bg-stone-300 text-stone-900' : ''
          }`}
          title="Section Header (H1)"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-xs font-serif font-bold hover:bg-stone-200 transition ${
            editor.isActive('heading', { level: 2 }) ? 'bg-stone-300 text-stone-900' : ''
          }`}
          title="Subheading (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded text-xs font-serif font-bold hover:bg-stone-200 transition ${
            editor.isActive('heading', { level: 3 }) ? 'bg-stone-300 text-stone-900' : ''
          }`}
          title="Minor Heading (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded text-xs hover:bg-stone-200 transition ${
            editor.isActive('bulletList') ? 'bg-stone-300 text-stone-900' : ''
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded text-xs hover:bg-stone-200 transition ${
            editor.isActive('orderedList') ? 'bg-stone-300 text-stone-900' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded text-xs hover:bg-stone-200 transition ${
            editor.isActive('blockquote') ? 'bg-stone-300 text-stone-900' : ''
          }`}
          title="Pull Quote / Editorial Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded text-xs hover:bg-stone-200 transition"
          title="Divider Line"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded text-xs hover:bg-stone-200 transition ${
            editor.isActive('link') ? 'bg-stone-300 text-stone-900' : ''
          }`}
          title="Insert Hyperlink"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Upload Image from Device */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-2 py-1 rounded text-xs font-medium bg-stone-200 hover:bg-stone-300 text-stone-800 flex items-center gap-1 transition"
          title="Upload image from computer/device to article"
        >
          {isUploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
          ) : (
            <Upload className="w-3.5 h-3.5 text-red-600" />
          )}
          <span>Upload Image</span>
        </button>

        {/* Insert Image by URL */}
        <button
          type="button"
          onClick={addImageUrl}
          className="p-1.5 rounded text-xs hover:bg-stone-200 transition text-stone-600"
          title="Insert Image by Web URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-1.5 rounded text-xs hover:bg-stone-200 disabled:opacity-30 transition"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-1.5 rounded text-xs hover:bg-stone-200 disabled:opacity-30 transition"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[260px] max-h-[480px] overflow-y-auto font-serif text-stone-900 leading-relaxed text-base focus:outline-none prose prose-stone max-w-none relative">
        {isUploading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="flex items-center gap-2 bg-stone-900 text-white px-3 py-1.5 rounded-full text-xs shadow-md">
              <Loader2 className="w-4 h-4 animate-spin text-red-400" />
              <span>Optimizing & embedding image...</span>
            </div>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
