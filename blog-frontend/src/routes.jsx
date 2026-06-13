import React from 'react'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public Pages
import HomePage from './pages/public/HomePage'
import AllBlogsPage from './pages/public/AllBlogsPage'
import ParentBlogPage from './pages/public/ParentBlogPage'
import SingleBlogPage from './pages/public/SingleBlogPage'
import SearchPage from './pages/public/SearchPage'
import TagsPage from './pages/public/TagsPage'
import TagDetailPage from './pages/public/TagDetailPage'
import AuthorPage from './pages/public/AuthorPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import PrivacyPolicy from './pages/public/PrivacyPolicy'
import TermsAndConditions from './pages/public/TermsAndConditions'
import CookiePolicy from './pages/public/CookiePolicy'
import NotFoundPage from './pages/public/NotFoundPage'
import ErrorPage from './pages/public/ErrorPage'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import ParentBlogsPage from './pages/admin/ParentBlogsPage'
import ChildBlogsPage from './pages/admin/ChildBlogsPage'
import CommentsPage from './pages/admin/CommentsPage'
import AdminTagsPage from './pages/admin/TagsPage'
import AnalyticsPage from './pages/admin/AnalyticsPage'
import ProfilePage from './pages/admin/ProfilePage'
import NotificationsPage from './pages/admin/NotificationsPage'

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/blogs', element: <AllBlogsPage /> },
  { path: '/blogs/:parentSlug', element: <ParentBlogPage /> },
  { path: '/blog/:slug', element: <SingleBlogPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/tags', element: <TagsPage /> },
  { path: '/tags/:slug', element: <TagDetailPage /> },
  { path: '/authors/:id', element: <AuthorPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/privacy', element: <PrivacyPolicy /> },
  { path: '/terms', element: <TermsAndConditions /> },
  { path: '/cookie-policy', element: <CookiePolicy /> },
  { path: '/500', element: <ErrorPage /> },
  { path: '*', element: <NotFoundPage /> },

  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/parent-blogs',
    element: (
      <ProtectedRoute>
        <ParentBlogsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/child-blogs',
    element: (
      <ProtectedRoute>
        <ChildBlogsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/comments',
    element: (
      <ProtectedRoute>
        <CommentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/tags',
    element: (
      <ProtectedRoute>
        <AdminTagsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/analytics',
    element: (
      <ProtectedRoute>
        <AnalyticsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/notifications',
    element: (
      <ProtectedRoute>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },
]

export default routes
