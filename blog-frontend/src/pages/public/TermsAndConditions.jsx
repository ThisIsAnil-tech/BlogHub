import React from 'react'
import { FileText, Mail } from 'lucide-react'

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-md">
        <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="p-3 bg-primary bg-opacity-25 rounded-lg text-primary">
            <FileText size={36} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Terms & Conditions</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last updated: June 13, 2026</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            Welcome to BlogHub! These terms and conditions outline the rules and regulations for the use of BlogHub's Website.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">1. License</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Unless otherwise stated, BlogHub and/or its licensors own the intellectual property rights for all material on BlogHub. All intellectual property rights are reserved. You may access this from BlogHub for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p className="text-gray-600 dark:text-gray-300">You must not:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-gray-300">
            <li>Republish material from BlogHub without proper attribution.</li>
            <li>Sell, rent, or sub-license material from BlogHub.</li>
            <li>Reproduce, duplicate, or copy material from BlogHub.</li>
            <li>Redistribute content from BlogHub.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">2. User Comments and Submissions</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. BlogHub does not filter, edit, publish, or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of BlogHub, its agents, and/or affiliates.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            BlogHub reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive, or causes breach of these Terms and Conditions.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">3. Hyperlinking to our Content</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Organizations may link to our home page, to publications, or to other website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">4. Disclaimer</h2>
          <p className="text-gray-600 dark:text-gray-300">
            To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600 dark:text-gray-300">
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">5. Contact Us</h2>
          <p className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Mail size={18} className="text-primary mr-1" />
            <span>If you have any queries regarding any of our terms, please contact us at <a href="mailto:terms@bloghub.com" className="text-primary hover:underline">terms@bloghub.com</a>.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
