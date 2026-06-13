import api from './api'

export const commentService = {
  // Public endpoints
  getCommentsByBlog: async (blogId, includeReplies = true) => {
    return api.get(`/comments/blog/${blogId}`, { params: { includeReplies } })
  },

  createComment: async (blogId, commentData) => {
    return api.post(`/comments/blog/${blogId}`, commentData)
  },

  // Admin endpoints
  getAdminComments: async (page = 1, limit = 20, status = 'pending') => {
    return api.get('/comments/admin/list', { params: { page, limit, status } })
  },

  approveComment: async (id) => {
    return api.put(`/comments/${id}/approve`)
  },

  deleteComment: async (id) => {
    return api.delete(`/comments/${id}`)
  },

  bulkApprove: async (ids) => {
    return api.post('/comments/bulk-approve', { ids })
  },

  bulkDelete: async (ids) => {
    return api.post('/comments/bulk-delete', { ids })
  },
}