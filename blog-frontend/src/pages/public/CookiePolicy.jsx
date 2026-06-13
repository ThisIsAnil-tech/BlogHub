import React from 'react'
import { Cookie, Mail } from 'lucide-react'

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-md">
        <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="p-3 bg-primary bg-opacity-25 rounded-lg text-primary">
            <Cookie size={36} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Cookie Policy</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last updated: June 13, 2026</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            This is the Cookie Policy for BlogHub, accessible from our website. We use cookies to enhance and secure your browsing experience.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">1. What Are Cookies</h2>
          <p className="text-gray-600 dark:text-gray-300">
            As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use them, and why we sometimes need to store these cookies.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">2. How We Use Cookies</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">3. The Cookies We Set</h2>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-gray-300">
            <li>
              <strong>Security / Session Cookies:</strong> We set an HttpOnly secure cookie named <code>refreshToken</code> to manage your authentication state securely. This prevents cross-site scripting (XSS) access to your credentials and supports token rotation.
            </li>
            <li>
              <strong>Preference Cookies:</strong> We use cookies to remember your theme preferences (dark mode vs. light mode) and multi-language preference.
            </li>
            <li>
              <strong>Cookie Consent Choice:</strong> When you accept our cookie banner, we set a cookie to remember your preference for 365 days.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">4. Disabling Cookies</h2>
          <p className="text-gray-600 dark:text-gray-300">
            You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling security cookies will prevent you from logging into the administrative panel.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">5. Contact Us</h2>
          <p className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Mail size={18} className="text-primary mr-1" />
            <span>If you have any questions, feel free to contact us at <a href="mailto:cookies@bloghub.com" className="text-primary hover:underline">cookies@bloghub.com</a>.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CookiePolicy
