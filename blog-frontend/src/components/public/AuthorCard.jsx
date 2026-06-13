import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Globe, Twitter, Github, Linkedin, BookOpen } from 'lucide-react'

const AuthorCard = ({ author }) => {
  const socialLinks = [
    { icon: Twitter, href: author.socialLinks?.twitter, label: 'Twitter' },
    { icon: Github, href: author.socialLinks?.github, label: 'GitHub' },
    { icon: Linkedin, href: author.socialLinks?.linkedin, label: 'LinkedIn' },
    { icon: Globe, href: author.socialLinks?.website, label: 'Website' },
  ].filter((link) => link.href)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-2xl font-bold text-dark">
            {author.username?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-dark dark:text-light mb-2">
            {author.username}
          </h3>
          {author.bio && (
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {author.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <BookOpen size={16} className="mr-1" />
              <span>{author.postCount || 0} posts</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Mail size={16} className="mr-1" />
              <span>{author.email}</span>
            </div>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex space-x-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary dark:bg-gray-700 text-dark dark:text-light rounded-full hover:bg-accent transition-colors"
                  aria-label={link.label}
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          <Link
            to={`/authors/${author.id}`}
            className="px-4 py-2 bg-accent hover:bg-opacity-90 text-dark font-medium rounded-lg transition-colors"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuthorCard