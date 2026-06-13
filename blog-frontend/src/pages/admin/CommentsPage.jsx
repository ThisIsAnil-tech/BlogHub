import React, { useState } from 'react'
import Layout from '../../components/layout/Layout'
import DataTable from '../../components/admin/DataTable'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentService } from '../../services/comments'
import { MessageSquare, Check, X, Eye, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const CommentsPage = () => {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('pending')
  const queryClient = useQueryClient()

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments-admin', page, status],
    queryFn: () => commentService.getAdminComments(page, 10, status),
  })

  const approveMutation = useMutation({
    mutationFn: (id) => commentService.approveComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments-admin'])
      toast.success('Comment approved')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to approve comment')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => commentService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments-admin'])
      toast.success('Comment deleted')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete comment')
    },
  })

  const bulkApproveMutation = useMutation({
    mutationFn: (ids) => commentService.bulkApprove(ids),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments-admin'])
      toast.success('Comments approved successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to approve comments')
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids) => commentService.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments-admin'])
      toast.success('Comments deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete comments')
    },
  })

  const handleApprove = (comment) => {
    approveMutation.mutate(comment.id)
  }

  const handleDelete = (comment) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteMutation.mutate(comment.id)
    }
  }

  const handleBulkAction = (action, ids) => {
    if (action === 'approve') {
      if (window.confirm(`Approve ${ids.length} comments?`)) {
        bulkApproveMutation.mutate(ids)
      }
    } else if (action === 'delete') {
      if (window.confirm(`Delete ${ids.length} comments?`)) {
        bulkDeleteMutation.mutate(ids)
      }
    }
  }

  const columns = [
    { 
      key: 'content', 
      title: 'Comment',
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    { 
      key: 'name', 
      title: 'Author',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    { 
      key: 'blog', 
      title: 'Post',
      render: (value) => value?.title || 'Unknown'
    },
    { 
      key: 'createdAt', 
      title: 'Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light">
              Comments
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage and moderate user comments
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setStatus('pending')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  status === 'pending'
                    ? 'bg-white dark:bg-gray-700 shadow'
                    : 'hover:bg-white dark:hover:bg-gray-700'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatus('approved')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  status === 'approved'
                    ? 'bg-white dark:bg-gray-700 shadow'
                    : 'hover:bg-white dark:hover:bg-gray-700'
                }`}
              >
                Approved
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                <MessageSquare className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark dark:text-light">
                  {comments?.total || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Comments
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-4">
                <MessageSquare className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark dark:text-light">
                  {status === 'pending' ? comments?.total || 0 : 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pending Review
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                <MessageSquare className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark dark:text-light">
                  {status === 'approved' ? comments?.total || 0 : 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Approved
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={comments?.data || []}
          loading={isLoading}
          totalPages={comments?.totalPages || 1}
          currentPage={page}
          onPageChange={setPage}
          onEdit={(comment) => {/* View comment details */}}
          onDelete={handleDelete}
          onBulkAction={handleBulkAction}
          searchable={true}
          selectable={true}
          customActions={(row) => (
            <>
              {status === 'pending' && (
                <button
                  onClick={() => handleApprove(row)}
                  className="p-2 hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400 rounded transition-colors"
                  title="Approve"
                >
                  <Check size={18} />
                </button>
              )}
              <button
                onClick={() => handleDelete(row)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        />
      </div>
    </Layout>
  )
}

export default CommentsPage