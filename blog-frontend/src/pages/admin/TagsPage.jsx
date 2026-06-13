import React, { useState } from 'react'
import Layout from '../../components/layout/Layout'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/common/Modal'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagService } from '../../services/tags'
import { Plus, Hash, TrendingUp, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const TagsPage = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState(null)
  const queryClient = useQueryClient()

  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags-admin', page, search],
    queryFn: () => tagService.getAllTags(false, 20), // Get all tags for admin
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => tagService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags-admin'])
      toast.success('Tag deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete tag')
    },
  })

  const createMutation = useMutation({
    mutationFn: (data) => tagService.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags-admin'])
      toast.success('Tag created successfully')
      setIsModalOpen(false)
      setEditingTag(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create tag')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => tagService.updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags-admin'])
      toast.success('Tag updated successfully')
      setIsModalOpen(false)
      setEditingTag(null)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update tag')
    },
  })

  const handleEdit = (tag) => {
    setEditingTag(tag)
    setIsModalOpen(true)
  }

  const handleDelete = (tag) => {
    if (window.confirm(`Are you sure you want to delete "${tag.name}"?`)) {
      deleteMutation.mutate(tag.id)
    }
  }

  const handleBulkAction = (action, ids) => {
    if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${ids.length} tags?`)) {
        ids.forEach(id => deleteMutation.mutate(id))
      }
    }
  }

  const handleSubmit = (data) => {
    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const columns = [
    { key: 'name', title: 'Name' },
    { 
      key: 'slug', 
      title: 'Slug',
      render: (value) => (
        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {value}
        </code>
      )
    },
    { 
      key: 'count', 
      title: 'Usage',
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
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
              Tags
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage and organize content with tags
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTag(null)
              setIsModalOpen(true)
            }}
            className="px-4 py-2 bg-accent hover:bg-opacity-90 text-dark font-medium rounded-lg flex items-center transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add New Tag
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary rounded-lg mr-4">
                <Hash className="text-dark" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark dark:text-light">
                  {tags?.length || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Tags
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-secondary rounded-lg mr-4">
                <TrendingUp className="text-dark" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark dark:text-light">
                  {tags?.reduce((sum, tag) => sum + tag.count, 0) || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Usage
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-accent rounded-lg mr-4">
                <Hash className="text-dark" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark dark:text-light">
                  {tags?.[0]?.name || 'None'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Most Popular
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary rounded-lg mr-4">
                <Hash className="text-dark" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark dark:text-light">
                  {Math.round(tags?.reduce((sum, tag) => sum + tag.count, 0) / (tags?.length || 1))}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Avg Usage
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={tags || []}
          loading={isLoading}
          totalPages={1}
          currentPage={1}
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
          onClose={() => {
            setIsModalOpen(false)
            setEditingTag(null)
          }}
          title={editingTag ? 'Edit Tag' : 'Create New Tag'}
          size="medium"
        >
          <TagForm
            tag={editingTag}
            onSubmit={handleSubmit}
            isLoading={createMutation.isLoading || updateMutation.isLoading}
            onClose={() => {
              setIsModalOpen(false)
              setEditingTag(null)
            }}
          />
        </Modal>
      </div>
    </Layout>
  )
}

// Tag Form Component
const TagForm = ({ tag, onSubmit, isLoading, onClose }) => {
  const [formData, setFormData] = useState({
    name: tag?.name || '',
    description: tag?.description || '',
    slug: tag?.slug || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-dark dark:text-light mb-2">
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={handleNameChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Enter tag name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark dark:text-light mb-2">
          Slug
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="tag-slug"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          URL-friendly version of the name
        </p>
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
          placeholder="Brief description of the tag"
        />
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
          className="px-6 py-2 bg-accent hover:bg-opacity-90 text-dark font-medium rounded-lg transition-colors"
        >
          {isLoading ? 'Saving...' : tag ? 'Update Tag' : 'Create Tag'}
        </button>
      </div>
    </form>
  )
}

export default TagsPage