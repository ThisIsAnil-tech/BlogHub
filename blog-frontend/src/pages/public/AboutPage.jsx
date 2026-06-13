import React from 'react'
import Layout from '../../components/layout/Layout'
import { Users, Target, Globe, Heart, Award, BookOpen } from 'lucide-react'

const AboutPage = () => {
  const teamMembers = [
    { name: 'John Doe', role: 'Founder & CEO', bio: '10+ years in tech' },
    { name: 'Jane Smith', role: 'Lead Developer', bio: 'React specialist' },
    { name: 'Bob Johnson', role: 'Content Manager', bio: 'Editor & writer' },
    { name: 'Alice Brown', role: 'Community Lead', bio: 'Community builder' },
  ]

  const values = [
    { icon: Target, title: 'Quality Content', description: 'We focus on delivering high-quality, well-researched articles' },
    { icon: Users, title: 'Community First', description: 'Our readers and writers are at the heart of everything we do' },
    { icon: Globe, title: 'Global Perspective', description: 'We bring diverse perspectives from around the world' },
    { icon: Heart, title: 'Passion Driven', description: 'Written by passionate experts in their fields' },
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-secondary rounded-2xl p-8 md:p-12 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            About BlogHub
          </h1>
          <p className="text-xl text-dark opacity-90">
            A modern platform where ideas meet innovation, and stories find their audience.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-dark dark:text-light mb-6">
            Our Story
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Founded in 2023, BlogHub began as a simple idea: create a space where writers,
              developers, and thinkers could share their knowledge and experiences with the world.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              What started as a small community blog has grown into a vibrant platform with
              thousands of articles, hundreds of contributors, and readers from all over the globe.
            </p>
          </div>
        </div>

        {/* Our Mission */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-12">
          <div className="flex items-center mb-6">
            <Target size={32} className="text-accent mr-4" />
            <h2 className="text-3xl font-bold text-dark dark:text-light">
              Our Mission
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            To democratize knowledge sharing by providing an accessible platform for creators
            to publish quality content and for readers to discover valuable insights across
            technology, lifestyle, business, and creative fields.
          </p>
        </div>

        {/* Our Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-dark dark:text-light mb-8">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-xl transition-shadow"
              >
                <value.icon size={32} className="text-accent mb-4" />
                <h3 className="text-xl font-semibold text-dark dark:text-light mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-dark dark:text-light mb-8">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
              >
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-2xl font-bold text-dark mx-auto mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-dark dark:text-light mb-1">
                  {member.name}
                </h3>
                <p className="text-accent mb-2">{member.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-accent rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-dark mb-8 text-center">
            By The Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-dark">1,250+</div>
              <div className="text-dark opacity-90">Articles Published</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-dark">150+</div>
              <div className="text-dark opacity-90">Active Writers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-dark">50K+</div>
              <div className="text-dark opacity-90">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-dark">25+</div>
              <div className="text-dark opacity-90">Countries Reached</div>
            </div>
          </div>
        </div>

        {/* Join Us */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <Award size={48} className="mx-auto text-accent mb-4" />
          <h2 className="text-3xl font-bold text-dark dark:text-light mb-4">
            Join Our Community
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Whether you're a writer looking to share your knowledge or a reader seeking
            valuable insights, there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/blogs"
              className="px-6 py-3 bg-accent hover:bg-opacity-90 text-dark font-medium rounded-lg transition-colors"
            >
              Start Reading
            </a>
            <a
              href="/contact"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-primary dark:hover:bg-gray-700 transition-colors"
            >
              Become a Writer
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage