import React, { useRef } from 'react'
import { Upload } from 'lucide-react'
import './FileUpload.css'

const FileUpload = ({ onFileUpload, uploadedFile }) => {
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0])
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="file-upload">
      <h2>Upload RFP Document</h2>
      
      {uploadedFile ? (
        <div className="file-preview">
          <div className="file-info">
            <p className="file-name">{uploadedFile.name}</p>
            <p className="file-size">{formatFileSize(uploadedFile.size)}</p>
          </div>
          <button 
            className="remove-file-btn"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Remove button clicked in FileUpload');
              onFileUpload(null);
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div 
          className="drop-zone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <Upload size={48} className="upload-icon" />
          <p>Drag & drop your PDF file here</p>
          <p className="or-text">or</p>
          <button className="browse-btn">Browse Files</button>
          <p className="file-info-text">PDF files only, maximum 10MB</p>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf"
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  )
}

export default FileUpload