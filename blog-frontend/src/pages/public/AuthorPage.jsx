import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import BlogCard from '../../components/public/BlogCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { blogService } from '../../services/blogs'
import { ArrowLeft, Mail, Globe, Twitter, Github, Linkedin, Calendar, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

const AuthorPage = () => {
  const { id } = useParams()

  // This would normally come from an author API
  // For now, we'll use mock data
  const author = {
    id: id,
    username: 'John Doe',
    email: 'john@example.com',
    bio: 'Senior software engineer with 10+ years of experience in web development. Passionate about React, Node.js, and open-source projects.',
    profileImage: null,
    socialLinks: {
      twitter: 'https://twitter.com/johndoe',
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      website: 'https://johndoe.dev',
    },
    joinDate: '2020-01-15',
    postCount: 42,
    totalViews: 12500,
    totalComments: 156,
  }

  const { data: authorBlogs, isLoading, error } = useQuery({
    queryKey: ['author-blogs', id],
    queryFn: () => blogService.getAllChildBlogs({ authorId: id, limit: 6 }),
  })

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-accent hover:text-opacity-90 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>

        {/* Author Header */}
        <div className="bg-secondary rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center text-4xl font-bold text-dark">
              {author.username.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-4xl font-bold text-dark mb-2">
                {author.username}
              </h1>
              <p className="text-dark opacity-90 mb-4">
                {author.bio}
              </p>
              
              {/* Social Links */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {author.socialLinks.twitter && (
                  <a
                    href={author.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white text-dark rounded-full hover:bg-accent transition-colors"
                  >
                    <Twitter size={20} />
                  </a>
                )}
                {author.socialLinks.github && (
                  <a
                    href={author.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white text-dark rounded-full hover:bg-accent transition-colors"
                  >
                    <Github size={20} />
                  </a>
                )}
                {author.socialLinks.linkedin && (
                  <a
                    href={author.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white text-dark rounded-full hover:bg-accent transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
                {author.socialLinks.website && (
                  <a
                    href={author.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white text-dark rounded-full hover:bg-accent transition-colors"
                  >
                    <Globe size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <BookOpen size={24} className="mx-auto text-accent mb-2" />
            <div className="text-2xl font-bold text-dark dark:text-light">{author.postCount}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-dark dark:text-light">
              {author.totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Views</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-dark dark:text-light">{author.totalComments}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Comments</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <Calendar size={24} className="mx-auto text-accent mb-2" />
            <div className="text-2xl font-bold text-dark dark:text-light">
              {new Date(author.joinDate).getFullYear()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Joined</div>
          </div>
        </div>

        {/* Author's Blog Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark dark:text-light mb-6">
            Latest Posts by {author.username}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <ErrorMessage message={error.message} />
          ) : authorBlogs?.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No posts available from this author yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorBlogs?.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
            Contact Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail size={18} className="text-gray-500 mr-3" />
              <a
                href={`mailto:${author.email}`}
                className="text-dark dark:text-light hover:text-accent transition-colors"
              >
                {author.email}
              </a>
            </div>
            {author.socialLinks.website && (
              <div className="flex items-center">
                <Globe size={18} className="text-gray-500 mr-3" />
                <a
                  href={author.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark dark:text-light hover:text-accent transition-colors"
                >
                  {author.socialLinks.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AuthorPage