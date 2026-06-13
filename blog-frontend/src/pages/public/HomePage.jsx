import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import BlogCard from '../../components/public/BlogCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { blogService } from '../../services/blogs'
import { ArrowRight, TrendingUp, Sparkles, BookOpen } from 'lucide-react'

const HomePage = () => {
  const { data: featuredBlogs, isLoading, error } = useQuery({
    queryKey: ['featured-blogs'],
    queryFn: () => blogService.getAllChildBlogs({ limit: 6, sortBy: 'date' }),
  })

  const { data: popularBlogs } = useQuery({
    queryKey: ['home-popular-blogs'],
    queryFn: () => blogService.getPopularBlogs(4),
  })

  if (error) return <ErrorMessage message={error.message} />

  const categories = [
    { name: 'Technology', count: 42, icon: '💻', bg: 'bg-primary', text: 'text-white' },
    { name: 'Lifestyle', count: 28, icon: '🌟', bg: 'bg-secondary', text: 'text-text' },
    { name: 'Travel', count: 35, icon: '✈️', bg: 'bg-accent', text: 'text-text' },
    { name: 'Food', count: 19, icon: '🍽️', bg: 'bg-light', text: 'text-text' },
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="mb-12">
        <div className="bg-secondary rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
              Welcome to BlogHub
            </h1>
            <p className="text-text-light text-lg mb-6">
              Discover amazing stories, creative ideas, and expert insights.
              Join our community of writers and readers today.
            </p>
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium shadow-md">
              Start Reading
            </button>
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text flex items-center">
            <Sparkles size={22} className="mr-2 text-primary" />
            Featured Blogs
          </h2>
          <a
            href="/blogs"
            className="flex items-center text-primary hover:text-secondary font-medium transition-colors"
          >
            View All <ArrowRight size={18} className="ml-1" />
          </a>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs?.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>

      {/* Popular & Newsletter Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Popular Blogs */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-text mb-4 flex items-center">
            <TrendingUp size={20} className="mr-2 text-primary" />
            Most Popular
          </h3>
          <div className="space-y-4">
            {popularBlogs?.map((blog, index) => (
              <div
                key={blog.id}
                className="flex items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-primary mr-4 w-8 text-center">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-text mb-1 line-clamp-1">
                    <a href={`/blog/${blog.slug}`} className="hover:text-primary transition-colors">
                      {blog.title}
                    </a>
                  </h4>
                  <p className="text-sm text-text-light">
                    {blog.views} views • {blog.comments} comments
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-dark rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-text mb-2">
            Newsletter
          </h3>
          <p className="text-text-light mb-6">
            Subscribe to our newsletter and get the latest updates directly in your inbox.
          </p>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-primary hover:bg-secondary text-white font-medium py-3 rounded-lg transition-colors"
            >
              Subscribe Now
            </button>
          </form>
          <p className="text-xs text-text-light mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h3 className="text-xl font-bold text-text mb-6 flex items-center">
          <BookOpen size={20} className="mr-2 text-primary" />
          Browse Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`${category.bg} ${category.text} rounded-lg p-6 text-center cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md`}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h4 className="text-lg font-bold mb-1">{category.name}</h4>
              <p className="text-sm opacity-90">{category.count} posts</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default HomePage