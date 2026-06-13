import React, { useState } from 'react'
import Layout from '../../components/layout/Layout'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService } from '../../services/blogs'
import { Plus, Edit, Eye, Trash2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const ParentBlogsPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const queryClient = useQueryClient()

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['parent-blogs-admin', page, search],
    queryFn: () => blogService.getAdminParentBlogs(page, 10, search),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => blogService.deleteParentBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['parent-blogs-admin'])
      toast.success('Parent blog deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete blog')
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

  const columns = [
    { key: 'title', title: 'Title' },
    { 
      key: 'isPublished', 
      title: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {value ? 'Published' : 'Draft'}
        </span>
      )
    },
    { 
      key: 'childrenCount', 
      title: 'Posts',
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    { key: 'order', title: 'Order' },
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
              Parent Blogs
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage blog categories and sections
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
            Add New Category
          </button>
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
          searchable={true}
          selectable={true}
        />

        {/* Edit/Create Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingBlog ? 'Edit Category' : 'Create New Category'}
          size="medium"
        >
          {editingBlog ? (
            <EditCategoryForm
              blog={editingBlog}
              onClose={() => setIsModalOpen(false)}
            />
          ) : (
            <CreateCategoryForm
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </Modal>
      </div>
    </Layout>
  )
}

// Edit Category Form Component
const EditCategoryForm = ({ blog, onClose }) => {
  const [formData, setFormData] = useState({
    title: blog.title,
    description: blog.description,
    imageUrl: blog.imageUrl,
    order: blog.order,
    isPublished: blog.isPublished,
    tags: blog.tags?.map(t => t.id) || [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Category updated successfully')
      queryClient.invalidateQueries(['parent-blogs-admin'])
      onClose()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-dark dark:text-light mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark dark:text-light mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark dark:text-light mb-2">
            Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark dark:text-light mb-2">
            Status
          </label>
          <select
            value={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === 'true' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-accent hover:bg-opacity-90 text-dark font-medium rounded-lg flex items-center transition-colors"
        >
          {isLoading ? <LoadingSpinner size="small" /> : 'Update Category'}
        </button>
      </div>
    </form>
  )
}

// Create Category Form Component
const CreateCategoryForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    order: 0,
    isPublished: true,
    tags: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Category created successfully')
      queryClient.invalidateQueries(['parent-blogs-admin'])
      onClose()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-dark dark:text-light mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Enter category title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark dark:text-light mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Brief description of the category"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark dark:text-light mb-2">
            Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark dark:text-light mb-2">
            Status
          </label>
          <select
            value={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === 'true' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-accent hover:bg-opacity-90 text-dark font-medium rounded-lg flex items-center transition-colors"
        >
          {isLoading ? <LoadingSpinner size="small" /> : 'Create Category'}
        </button>
      </div>
    </form>
  )
}

export default ParentBlogsPage