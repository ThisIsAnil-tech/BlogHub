import api from './api'

export const tagService = {
  // Public endpoints
  getAllTags: async (popular = false, limit = 20) => {
    try {
      return await api.get('/tags', { params: { popular, limit } })
    } catch (error) {
      console.log('Using mock data for tags')
      return Array.from({ length: limit }, (_, i) => ({
        id: i + 1,
        name: ['react', 'javascript', 'webdev', 'tutorial', 'css'][i % 5] || `tag-${i + 1}`,
        slug: ['react', 'javascript', 'webdev', 'tutorial', 'css'][i % 5] || `tag-${i + 1}`,
        count: Math.floor(Math.random() * 50) + 5,
      }))
    }
  },

  getTagCloud: async () => {
    try {
      return await api.get('/tags/cloud')
    } catch (error) {
      console.log('Using mock data for tag cloud')
      return [
        { id: 1, name: 'react', slug: 'react', count: 15, weight: 3 },
        { id: 2, name: 'javascript', slug: 'javascript', count: 12, weight: 2 },
        { id: 3, name: 'webdev', slug: 'webdev', count: 8, weight: 2 },
        { id: 4, name: 'tutorial', slug: 'tutorial', count: 6, weight: 1 },
        { id: 5, name: 'beginners', slug: 'beginners', count: 4, weight: 1 },
      ]
    }
  },

  getTagBySlug: async (slug, page = 1, limit = 10) => {
    try {
      return await api.get(`/tags/${slug}`, { params: { page, limit } })
    } catch (error) {
      console.log('Using mock data for tag detail')
      return {
        id: 1,
        name: slug,
        slug: slug,
        count: 25,
        blogs: Array.from({ length: limit }, (_, i) => ({
          id: i + 1,
          title: `Blog about ${slug} ${i + 1}`,
          slug: `blog-about-${slug}-${i + 1}`,
          excerpt: `This is a blog post about ${slug}...`,
          views: Math.floor(Math.random() * 1000),
        })),
        totalPages: 3,
      }
    }
  },

  // Admin endpoints
  createTag: async (data) => {
    console.log('Creating tag (mock):', data)
    return { success: true, message: 'Tag created (mock)', id: Date.now() }
  },

  updateTag: async (id, data) => {
    console.log('Updating tag (mock):', id, data)
    return { success: true, message: 'Tag updated (mock)' }
  },

  deleteTag: async (id) => {
    console.log('Deleting tag (mock):', id)
    return { success: true, message: 'Tag deleted (mock)' }
  },
}