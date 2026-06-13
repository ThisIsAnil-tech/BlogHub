import React, { useState } from 'react'
import Layout from '../../components/layout/Layout'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/common/Modal'
import BlogEditor from '../../components/admin/BlogEditor'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService } from '../../services/blogs'
import { Plus, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const ChildBlogsPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const queryClient = useQueryClient()

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['child-blogs-admin', page, search, status],
    queryFn: () => blogService.getAdminChildBlogs(page, 10, search, status),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => blogService.deleteChildBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['child-blogs-admin'])
      toast.success('Blog deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete blog')
    },
  })

  const createMutation = useMutation({
    mutationFn: (data) => blogService.createChildBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['child-blogs-admin'])
      toast.success('Blog created successfully')
      setIsModalOpen(false)
      setEditingBlog(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create blog')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => blogService.updateChildBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['child-blogs-admin'])
      toast.success('Blog updated successfully')
      setIsModalOpen(false)
      setEditingBlog(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update blog')
    },
  })

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setIsModalOpen(true)
  }

  const handleDelete = (blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      deleteMutation.mutate(blog.id)
    }
  }

  const handleBulkAction = (action, ids) => {
    if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${ids.length} blogs?`)) {
        ids.forEach(id => deleteMutation.mutate(id))
      }
    }
  }

  const handleSubmit = (data) => {
    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const columns = [
    { key: 'title', title: 'Title' },
    { 
      key: 'parent', 
      title: 'Category',
      render: (value) => value?.title || 'Uncategorized'
    },
    { 
      key: 'isPublished', 
      title: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {value ? 'Published' : 'Draft'}
        </span>
      )
    },
    { 
      key: 'views', 
      title: 'Views',
      render: (value) => value.toLocaleString()
    },
    { 
      key: 'createdAt', 
      title: 'Created',
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
              Blog Posts
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage all blog posts
            </p>
          </div>
          <button
            onClick={() => {
              setEditingBlog(null)
              setIsModalOpen(true)
            }}
            className="px-4 py-2 bg-accent hover:bg-opacity-90 text-dark font-medium rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            New Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter size={18} className="mr-2 text-gray-500" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={blogs?.data || []}
          loading={isLoading}
          totalPages={blogs?.totalPages || 1}
          currentPage={page}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkAction={handleBulkAction}
          searchable={false}
          selectable={true}
        />

        {/* Editor Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingBlog(null)
          }}
          title={editingBlog ? 'Edit Blog Post' : 'Create New Post'}
          size="xlarge"
        >
          <BlogEditor
            initialData={editingBlog}
            onSubmit={handleSubmit}
            isLoading={createMutation.isLoading || updateMutation.isLoading}
          />
        </Modal>
      </div>
    </Layout>
  )
}

export default ChildBlogsPage