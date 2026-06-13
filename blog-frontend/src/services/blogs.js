import api from './api'

export const blogService = {
  // Public endpoints
  getAllParentBlogs: async (publishedOnly = true) => {
    try {
      return await api.get('/parent-blogs', { params: { publishedOnly } })
    } catch (error) {
      console.log('Using mock data for parent blogs')
      // Return empty array or mock data
      return publishedOnly ? [
        {
          id: 1,
          title: 'Technology',
          slug: 'technology',
          description: 'Latest tech news and tutorials',
          childrenCount: 15,
          isPublished: true,
          order: 1,
        },
        {
          id: 2,
          title: 'Lifestyle',
          slug: 'lifestyle',
          description: 'Life tips and stories',
          childrenCount: 12,
          isPublished: true,
          order: 2,
        },
      ] : []
    }
  },

  getParentBlogBySlug: async (slug) => {
    try {
      return await api.get(`/parent-blogs/${slug}`)
    } catch (error) {
      console.log('Using mock data for parent blog')
      return {
        id: 1,
        title: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug: slug,
        description: `All about ${slug}`,
        childrenCount: 10,
        isPublished: true,
        order: 1,
        children: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          title: `Blog Post ${i + 1} in ${slug}`,
          slug: `blog-${i + 1}-${slug}`,
          excerpt: 'Sample blog post excerpt...',
          views: Math.floor(Math.random() * 1000),
        })),
      }
    }
  },

  getAllChildBlogs: async (filters = {}) => {
    try {
      const { page = 1, limit = 10, q, tags, sortBy = 'date', order = 'desc' } = filters
      const response = await api.get('/child-blogs', { params: { page, limit, q, tags, sortBy, order } })
      
      const blogsList = response.blogs || response.data || []
      const pagination = response.pagination || {
        total: response.total || blogsList.length,
        page: response.page || page,
        limit: response.limit || limit,
        totalPages: response.totalPages || 1
      }
      
      const result = [...blogsList]
      result.total = pagination.total
      result.page = pagination.page
      result.limit = pagination.limit
      result.totalPages = pagination.totalPages
      return result
    } catch (error) {
      console.log('Using mock data for child blogs in catch')
      const limit = filters.limit || 10
      const page = filters.page || 1
      const result = []
      result.total = 0
      result.page = page
      result.limit = limit
      result.totalPages = 0
      return result
    }
  },

  getChildBlogBySlug: async (slug) => {
    try {
      return await api.get(`/child-blogs/${slug}`)
    } catch (error) {
      console.log('Using mock data for single blog')
      return {
        id: 1,
        title: 'Sample Blog Post',
        slug: slug,
        content: '<p>This is a sample blog post content. The backend is not available, so we are showing mock data.</p><p>You can still test all the frontend features!</p>',
        excerpt: 'Sample blog post excerpt...',
        featuredImage: 'https://picsum.photos/seed/blog/800/400',
        views: 1234,
        comments: 45,
        readingTime: 5,
        author: {
          id: 1,
          username: 'Admin User',
          email: 'admin@example.com',
          bio: 'Senior developer and blogger',
        },
        tags: [
          { id: 1, name: 'react', slug: 'react' },
          { id: 2, name: 'javascript', slug: 'javascript' },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        relatedPosts: Array.from({ length: 3 }, (_, i) => ({
          id: i + 2,
          title: `Related Post ${i + 1}`,
          slug: `related-post-${i + 1}`,
          excerpt: 'Related post excerpt...',
          featuredImage: `https://picsum.photos/seed/related${i + 1}/400/300`,
        })),
      }
    }
  },

  getPopularBlogs: async (limit = 10, period = '7d') => {
  try {
    const response = await api.get('/analytics/popular', { params: { limit, period } })
    // Make sure we return just the array, not an object
    return Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.log('Using mock data for popular blogs')
    return Array.from({ length: limit }, (_, i) => ({
      id: i + 1,
      title: `Popular Blog ${i + 1}`,
      slug: `popular-blog-${i + 1}`,
      views: Math.floor(Math.random() * 1000) + 500,
      comments: Math.floor(Math.random() * 50),
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    }))
  }
},

  // Admin endpoints (will return mock data)
  getAdminParentBlogs: async (page = 1, limit = 20, search = '') => {
    return {
      data: Array.from({ length: limit }, (_, i) => ({
        id: (page - 1) * limit + i + 1,
        title: `Parent Blog ${(page - 1) * limit + i + 1}`,
        description: 'Sample description',
        isPublished: true,
        childrenCount: Math.floor(Math.random() * 20),
        order: i + 1,
        createdAt: new Date().toISOString(),
      })),
      total: 100,
      page: page,
      limit: limit,
      totalPages: Math.ceil(100 / limit),
    }
  },

  createParentBlog: async (data) => {
    console.log('Creating parent blog (mock):', data)
    return { success: true, message: 'Blog created (mock)', id: Date.now() }
  },

  updateParentBlog: async (id, data) => {
    console.log('Updating parent blog (mock):', id, data)
    return { success: true, message: 'Blog updated (mock)' }
  },

  deleteParentBlog: async (id) => {
    console.log('Deleting parent blog (mock):', id)
    return { success: true, message: 'Blog deleted (mock)' }
  },

  getAdminChildBlogs: async (page = 1, limit = 20, search = '', status = 'all') => {
    return {
      data: Array.from({ length: limit }, (_, i) => ({
        id: (page - 1) * limit + i + 1,
        title: `Child Blog ${(page - 1) * limit + i + 1}`,
        parent: { title: 'Technology', id: 1 },
        isPublished: status !== 'draft',
        views: Math.floor(Math.random() * 1000),
        createdAt: new Date().toISOString(),
      })),
      total: 100,
      page: page,
      limit: limit,
      totalPages: Math.ceil(100 / limit),
    }
  },

  createChildBlog: async (data) => {
    console.log('Creating child blog (mock):', data)
    return { success: true, message: 'Blog created (mock)', id: Date.now() }
  },

  updateChildBlog: async (id, data) => {
    console.log('Updating child blog (mock):', id, data)
    return { success: true, message: 'Blog updated (mock)' }
  },

  deleteChildBlog: async (id) => {
    console.log('Deleting child blog (mock):', id)
    return { success: true, message: 'Blog deleted (mock)' }
  },
}