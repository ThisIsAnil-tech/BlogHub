import React, { useState } from 'react'
import Pagination from '../common/Pagination'
import LoadingSpinner from '../common/LoadingSpinner'
import { Edit, Trash2, Eye, Check, X, Search } from 'lucide-react'

const DataTable = ({
  columns,
  data,
  loading,
  totalPages,
  currentPage,
  onPageChange,
  onEdit,
  onDelete,
  onView,
  onBulkAction,
  searchable = false,
  selectable = false,
}) => {
  const [selectedRows, setSelectedRows] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((item) => item.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    )
  }

  const handleBulkAction = (action) => {
    if (onBulkAction) {
      onBulkAction(action, selectedRows)
      setSelectedRows([])
    }
  }

  const filteredData = data.filter((item) =>
    columns.some((col) => {
      const value = item[col.key]
      return (
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-dark dark:text-light">
              {columns[0]?.title || 'Data Table'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Showing {filteredData.length} of {data.length} entries
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            )}

            {selectable && selectedRows.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center text-sm transition-colors"
                >
                  <Check size={16} className="mr-1" />
                  Approve ({selectedRows.length})
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center text-sm transition-colors"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete ({selectedRows.length})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {selectable && (
                <th className="text-left py-4 pl-6">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-accent rounded focus:ring-accent"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {column.title}
                </th>
              ))}
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-primary dark:hover:bg-gray-700 transition-colors"
              >
                {selectable && (
                  <td className="py-4 pl-6">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="w-4 h-4 text-accent rounded focus:ring-accent"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="py-4 px-4">
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : (
                      <span className="text-dark dark:text-light">
                        {row[column.key]}
                      </span>
                    )}
                  </td>
                ))}
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded transition-colors"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No data found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default DataTable