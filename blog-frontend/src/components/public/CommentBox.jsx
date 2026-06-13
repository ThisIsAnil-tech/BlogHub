import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { commentService } from '../../services/comments'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'
import { Send, Reply, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const CommentBox = ({ blogId, comments = [] }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [replyingTo, setReplyingTo] = useState(null)
  const [editingComment, setEditingComment] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const createCommentMutation = useMutation({
    mutationFn: (data) => commentService.createComment(blogId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', blogId])
      reset()
      setReplyingTo(null)
      setEditingComment(null)
      toast.success('Comment posted successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to post comment')
    },
  })

  const onSubmit = (data) => {
    const commentData = {
      ...data,
      parentId: replyingTo?.id || editingComment?.id || null,
    }
    createCommentMutation.mutate(commentData)
  }

  const renderComment = (comment, depth = 0) => {
    const isReply = depth > 0

    return (
      <div
        key={comment.id}
        className={`${isReply ? 'ml-8 mt-4' : 'mb-6'} ${
          depth > 2 ? 'ml-4' : ''
        }`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-dark font-bold mr-3">
                  {comment.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-dark dark:text-light">
                    {comment.name}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            {user && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setReplyingTo(comment)}
                  className="p-1 hover:bg-primary dark:hover:bg-gray-700 rounded transition-colors"
                  title="Reply"
                >
                  <Reply size={16} />
                </button>
                {user.email === comment.email && (
                  <>
                    <button
                      onClick={() => setEditingComment(comment)}
                      className="p-1 hover:bg-primary dark:hover:bg-gray-700 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>
          {replyingTo?.id === comment.id && (
            <div className="mt-3 p-3 bg-primary dark:bg-dark rounded">
              <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                  {...register('content', { required: 'Reply is required' })}
                  placeholder={`Replying to ${comment.name}...`}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                  rows="3"
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createCommentMutation.isLoading}
                    className="px-4 py-2 text-sm bg-accent hover:bg-opacity-90 text-dark rounded flex items-center transition-colors"
                  >
                    {createCommentMutation.isLoading ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <>
                        <Send size={16} className="mr-1" />
                        Post Reply
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        {/* Replies */}
        {comment.replies?.map((reply) => renderComment(reply, depth + 1))}
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-dark dark:text-light mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h4 className="text-lg font-semibold mb-4 text-dark dark:text-light">
          {editingComment ? 'Edit Comment' : replyingTo ? `Reply to ${replyingTo.name}` : 'Leave a Comment'}
        </h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                defaultValue={user?.username || ''}
                {...register('name', { required: 'Name is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                defaultValue={user?.email || ''}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Write your comment here..."
              defaultValue={editingComment?.content || ''}
              {...register('content', { required: 'Comment is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
              rows="4"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            {(replyingTo || editingComment) && (
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null)
                  setEditingComment(null)
                  reset()
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={createCommentMutation.isLoading}
              className="px-6 py-2 bg-accent hover:bg-opacity-90 text-dark font-medium rounded-lg flex items-center transition-colors"
            >
              {createCommentMutation.isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  {editingComment ? 'Update Comment' : 'Post Comment'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments
          .filter((comment) => !comment.parentId)
          .map((comment) => renderComment(comment))}
      </div>
    </div>
  )
}

export default CommentBox