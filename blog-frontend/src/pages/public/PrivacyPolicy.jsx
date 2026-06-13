import React from 'react'
import { ShieldCheck, Mail } from 'lucide-react'

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-md">
        <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="p-3 bg-primary bg-opacity-25 rounded-lg text-primary">
            <ShieldCheck size={36} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Privacy Policy</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last updated: June 13, 2026</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            At BlogHub, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by BlogHub and how we use it.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">1. Information We Collect</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We collect information in the following ways when you use our platform:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-gray-300">
            <li><strong>Account Information:</strong> When you register, we collect your name, email address, username, and password credentials.</li>
            <li><strong>Profile Information:</strong> You may choose to provide a bio, website link, and social profiles.</li>
            <li><strong>Comments & Submissions:</strong> Any comments or contact messages you submit to the site are processed and stored.</li>
            <li><strong>Analytics Data:</strong> We automatically track page views, referring websites, device IP addresses, browser types, and usage parameters.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">2. How We Use Your Information</h2>
          <p className="text-gray-600 dark:text-gray-300">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-gray-300">
            <li>Provide, operate, and maintain our blogging platform.</li>
            <li>Improve, personalize, and expand our services.</li>
            <li>Understand and analyze how you use our website.</li>
            <li>Prevent spam, abuse, and secure our network against unauthorized access.</li>
            <li>Communicate with you (e.g., about comments, notifications, or password resets).</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">3. Security of Data</h2>
          <p className="text-gray-600 dark:text-gray-300">
            The security of your personal information is a priority. We implement strict security headers, use JWT tokens, store refresh tokens in secure HttpOnly cookies, and encrypt passwords with 12+ rounds of bcrypt. However, please remember that no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">4. Cookies and Web Beacons</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Like any other website, BlogHub uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">5. Contact Us</h2>
          <p className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Mail size={18} className="text-primary mr-1" />
            <span>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:privacy@bloghub.com" className="text-primary hover:underline">privacy@bloghub.com</a>.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
