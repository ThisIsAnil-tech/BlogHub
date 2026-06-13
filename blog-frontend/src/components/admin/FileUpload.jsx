import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, File } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

const FileUpload = ({ onUploadComplete, accept = 'image/*', multiple = false }) => {
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsUploading(true)
    const file = acceptedFiles[0]
    if (!file) {
      setIsUploading(false)
      return
    }

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setIsUploading(false)
      const uploadedFile = response.image
      
      const newFileObj = {
        file,
        preview: uploadedFile.url,
        name: uploadedFile.fileName,
        size: uploadedFile.fileSize,
        type: uploadedFile.mimeType,
      }

      setFiles((prev) => [...prev, newFileObj])

      if (onUploadComplete) {
        onUploadComplete(uploadedFile.url)
      }
      toast.success('Image uploaded successfully!')
    } catch (error) {
      setIsUploading(false)
      const message = error.response?.data?.message || 'Failed to upload image.'
      toast.error(message)
    }
  }, [onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  })

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-accent bg-primary'
            : 'border-gray-300 dark:border-gray-600 hover:border-accent hover:bg-primary'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto text-gray-400 mb-3" size={48} />
        {isDragActive ? (
          <p className="text-dark dark:text-light">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-dark dark:text-light mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {accept === 'image/*' ? 'Images only' : 'All files accepted'}
              {!multiple && ' (Single file)'}
            </p>
          </div>
        )}
      </div>

      {/* Uploading Indicator */}
      {isUploading && (
        <div className="bg-primary dark:bg-dark rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-accent rounded-full animate-spin" />
            </div>
            <div className="ml-3 flex-grow">
              <p className="text-sm font-medium text-dark dark:text-light">
                Uploading...
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                <div className="bg-accent h-1.5 rounded-full animate-pulse" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-dark dark:text-light">
            Uploaded Files ({files.length})
          </h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                {file.type.startsWith('image/') ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-primary dark:bg-dark mr-3">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-primary dark:bg-dark flex items-center justify-center mr-3">
                    <File size={24} className="text-dark dark:text-light" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-dark dark:text-light truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload