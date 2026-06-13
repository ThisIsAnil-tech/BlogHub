import React, { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'

import FileUpload from './FileUpload'
import LoadingSpinner from '../common/LoadingSpinner'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Image as ImageIcon,
  Link,
  Quote,
  Undo,
  Redo,
  Save,
  Eye,
} from 'lucide-react'



const BlogEditor = ({ initialData, onSubmit, isLoading }) => {
  const [isPreview, setIsPreview] = useState(false)
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: initialData || {
      title: '',
      excerpt: '',
      parentId: '',
      isPublished: true,
      tags: [],
    },
  })

  const editor = useEditor({
  extensions: [StarterKit, Image, CodeBlock],
  content: initialData?.content || '<p>Start writing your blog post here...</p>',
  onUpdate: ({ editor }) => {
    setValue('content', editor.getHTML())
  },
})


  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      content: editor.getHTML(),
      featuredImage,
    })
  }

  const handleImageUpload = (imageUrl) => {
    setFeaturedImage(imageUrl)
  }

  if (!editor) return <LoadingSpinner />

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Toolbar */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded ${
                editor.isActive('bold')
                  ? 'bg-accent text-dark'
                  : 'hover:bg-primary dark:hover:bg-gray-700'
              }`}
            >
              <Bold size={20} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded ${
                editor.isActive('italic')
                  ? 'bg-accent text-dark'
                  : 'hover:bg-primary dark:hover:bg-gray-700'
              }`}
            >
              <Italic size={20} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded ${
                editor.isActive('bulletList')
                  ? 'bg-accent text-dark'
                  : 'hover:bg-primary dark:hover:bg-gray-700'
              }`}
            >
              <List size={20} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded ${
                editor.isActive('orderedList')
                  ? 'bg-accent text-dark'
                  : 'hover:bg-primary dark:hover:bg-gray-700'
              }`}
            >
              <ListOrdered size={20} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded ${
                editor.isActive('codeBlock')
                  ? 'bg-accent text-dark'
                  : 'hover:bg-primary dark:hover:bg-gray-700'
              }`}
            >
              <Code size={20} />
            </button>
            <button
              type="button"
              onClick={addImage}
              className="p-2 rounded hover:bg-primary dark:hover:bg-gray-700"
            >
              <ImageIcon size={20} />
            </button>
            <button
              type="button"
              onClick={addLink}
              className="p-2 rounded hover:bg-primary dark:hover:bg-gray-700"
            >
              <Link size={20} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded ${
                editor.isActive('blockquote')
                  ? 'bg-accent text-dark'
                  : 'hover:bg-primary dark:hover:bg-gray-700'
              }`}
            >
              <Quote size={20} />
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              className="p-2 rounded hover:bg-primary dark:hover:bg-gray-700"
            >
              <Undo size={20} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              className="p-2 rounded hover:bg-primary dark:hover:bg-gray-700"
            >
              <Redo size={20} />
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="p-2 rounded hover:bg-primary dark:hover:bg-gray-700"
            >
              <Eye size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter blog title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                Parent Category
              </label>
              <select
                {...register('parentId')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Select category</option>
                <option value="1">Technology</option>
                <option value="2">Lifestyle</option>
                <option value="3">Travel</option>
                <option value="4">Food</option>
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">
              Excerpt
            </label>
            <textarea
              {...register('excerpt')}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Brief description of the blog post"
            />
          </div>

          {/* Featured Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">
              Featured Image
            </label>
            <FileUpload onUploadComplete={handleImageUpload} />
            {featuredImage && (
              <div className="mt-2">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="max-w-xs rounded-lg shadow"
                />
              </div>
            )}
          </div>

          {/* Editor/Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">
              Content *
            </label>
            {isPreview ? (
              <div
                className="prose dark:prose-invert max-w-none p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[400px]"
                dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
              />
            ) : (
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <EditorContent
                  editor={editor}
                  className="prose dark:prose-invert max-w-none p-4 min-h-[400px] focus:outline-none"
                />
              </div>
            )}
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">
              Tags
            </label>
            <input
              type="text"
              placeholder="Add tags separated by commas"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
              onChange={(e) => {
                const tags = e.target.value.split(',').map((tag) => tag.trim())
                setValue('tags', tags)
              }}
              defaultValue={watch('tags').join(', ')}
            />
          </div>

          {/* Publish Options */}
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isPublished')}
                  className="w-4 h-4 text-accent rounded focus:ring-accent"
                />
                <span className="ml-2 text-sm text-dark dark:text-light">
                  Publish immediately
                </span>
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-accent hover:bg-opacity-90 text-dark font-medium rounded-lg flex items-center transition-colors"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Publish Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default BlogEditor