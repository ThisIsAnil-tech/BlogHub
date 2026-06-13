import React, { useState } from 'react'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../contexts/AuthContext'
import FileUpload from '../../components/admin/FileUpload'
import { User, Mail, Globe, Twitter, Github, Linkedin, Save, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
    socialLinks: {
      twitter: user?.socialLinks?.twitter || '',
      github: user?.socialLinks?.github || '',
      linkedin: user?.socialLinks?.linkedin || '',
      website: user?.socialLinks?.website || '',
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1]
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialKey]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleImageUpload = (imageUrl) => {
    setFormData({
      ...formData,
      profileImage: imageUrl,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateProfile(formData)
      if (result.success) {
        toast.success('Profile updated successfully')
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark dark:text-light">
            Profile Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center text-4xl font-bold text-dark mb-4 mx-auto">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      formData.username?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 p-2 bg-dark text-light rounded-full cursor-pointer hover:bg-opacity-90 transition-colors">
                    <Upload size={20} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            handleImageUpload(reader.result)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>
                <h3 className="text-xl font-bold text-dark dark:text-light">
                  {formData.username}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{formData.email}</p>
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                  Upload New Photo
                </label>
                <FileUpload
                  onUploadComplete={handleImageUpload}
                  accept="image/*"
                  multiple={false}
                />
              </div>

              {/* Account Info */}
              <div className="space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <User size={18} className="mr-3" />
                  <span>Admin Account</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Mail size={18} className="mr-3" />
                  <span>Verified Email</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-dark dark:text-light mb-6">
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-dark dark:text-light mb-6">
                  Social Links
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Twitter size={18} className="mr-2 text-blue-400" />
                      <label className="text-sm font-medium text-dark dark:text-light">
                        Twitter
                      </label>
                    </div>
                    <input
                      type="url"
                      name="socialLinks.twitter"
                      value={formData.socialLinks.twitter}
                      onChange={handleChange}
                      placeholder="https://twitter.com/username"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Github size={18} className="mr-2 text-gray-800 dark:text-gray-300" />
                      <label className="text-sm font-medium text-dark dark:text-light">
                        GitHub
                      </label>
                    </div>
                    <input
                      type="url"
                      name="socialLinks.github"
                      value={formData.socialLinks.github}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Linkedin size={18} className="mr-2 text-blue-600" />
                      <label className="text-sm font-medium text-dark dark:text-light">
                        LinkedIn
                      </label>
                    </div>
                    <input
                      type="url"
                      name="socialLinks.linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Globe size={18} className="mr-2 text-green-500" />
                      <label className="text-sm font-medium text-dark dark:text-light">
                        Website
                      </label>
                    </div>
                    <input
                      type="url"
                      name="socialLinks.website"
                      value={formData.socialLinks.website}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-accent hover:bg-opacity-90 text-dark font-medium rounded-lg flex items-center transition-colors"
                >
                  <Save size={20} className="mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage