import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import ClientInfo from './components/ClientInfo'
import ProcessingAnimation from './components/ProcessingAnimation'
import ResultsDisplay from './components/ResultsDisplay'
import KnowledgeBaseUpload from './components/KnowledgeBaseUpload'
import './App.css'

const App = () => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [clientEmail, setClientEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [knowledgeBaseSuccess, setKnowledgeBaseSuccess] = useState(null)
  const [rfpSuccess, setRfpSuccess] = useState(null)
  const [currentView, setCurrentView] = useState('main') // 'main', 'knowledgeBase', 'results'
  const [knowledgeBaseFile, setKnowledgeBaseFile] = useState(null)

  const handleFileUpload = (file) => {
    // Validate file type and size
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size exceeds 10MB limit.')
      return
    }
    
    setUploadedFile(file)
    setError(null)
  }

  const handleKnowledgeBaseUpload = (file) => {
    // Validate file type and size
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size exceeds 10MB limit.')
      return
    }
    
    setKnowledgeBaseFile(file)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!uploadedFile) {
      setError('Please upload a PDF file.')
      return
    }
    
    if (!clientEmail) {
      setError('Please enter your email address.')
      return
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(clientEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    
    setIsProcessing(true)
    setError(null)
    setKnowledgeBaseSuccess(null)
    setRfpSuccess(null)
    
    try {
      // Create FormData for webhook
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('email', clientEmail)
      formData.append('timestamp', new Date().toISOString())
      
      // Send to n8n webhook
      const response = await fetch('https://n8n.srv1020266.hstgr.cloud/webhook/4ef0c32e-879c-4d0f-9b38-0edebfb78ddb', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(90000) // 90-second timeout
      })
      
      if (!response.ok) {
        throw new Error(`Webhook request failed with status ${response.status}`)
      }
      
      const responseData = await response.json()
      
      // Log response for debugging
      console.log("=== WEBHOOK RESPONSE ===")
      console.log("Full response:", responseData)
      console.log("Response type:", Array.isArray(responseData) ? "array" : typeof responseData)
      
      // Extract output from response - the n8n webhook sends an array with objects
      if (Array.isArray(responseData) && responseData.length > 0) {
        // The data is already parsed as JSON, so we can use it directly
        const parsedData = responseData[0]
        console.log("Extracted data:", parsedData)
        setResults(parsedData)
        setCurrentView('results')
      } else {
        throw new Error('Invalid response format from webhook')
      }
    } catch (err) {
      console.error('Error processing RFP:', err)
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.')
      } else {
        setError(`Error processing RFP: ${err.message}`)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKnowledgeBaseSubmit = async () => {
    if (!knowledgeBaseFile) {
      setError('Please upload a PDF file.')
      return
    }
    
    setIsProcessing(true)
    setError(null)
    setKnowledgeBaseSuccess(null)
    setRfpSuccess(null)
    
    try {
      // Create FormData for knowledge base webhook
      const formData = new FormData()
      formData.append('file', knowledgeBaseFile)
      
      // Send to n8n knowledge base webhook
      const response = await fetch('https://n8n.srv1020266.hstgr.cloud/webhook/e9c80379-083e-444e-b797-06085847adc1', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(90000) // 90-second timeout
      })
      
      if (!response.ok) {
        throw new Error(`Knowledge base upload failed with status ${response.status}`)
      }
      
      // If we get here, the upload was successful
      setKnowledgeBaseSuccess('Knowledge base successfully updated!')
    } catch (err) {
      console.error('Error uploading knowledge base:', err)
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.')
      } else {
        setError(`Error uploading knowledge base: ${err.message}`)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setUploadedFile(null)
    setClientEmail('')
    setResults(null)
    setError(null)
    setKnowledgeBaseSuccess(null)
    setRfpSuccess(null)
    setCurrentView('main')
    setKnowledgeBaseFile(null)
  }

  const handleRetry = () => {
    setError(null)
    if (currentView === 'knowledgeBase') {
      handleKnowledgeBaseSubmit()
    } else {
      handleSubmit()
    }
  }

  const showKnowledgeBaseUpload = () => {
    setCurrentView('knowledgeBase')
    // Clear success message when switching to knowledge base view
    setKnowledgeBaseSuccess(null)
    setRfpSuccess(null)
    setError(null)
  }

  const showMainView = () => {
    setCurrentView('main')
    // Clear success message when switching to main view
    setKnowledgeBaseSuccess(null)
    setRfpSuccess(null)
    setError(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>EchoVibe Agency - AI RFP Assistant</h1>
        <p>Upload your RFP and receive a beautifully formatted proposal</p>
      </header>
      
      <main className="app-main">
        {isProcessing ? (
          <ProcessingAnimation />
        ) : currentView === 'results' && results ? (
          <ResultsDisplay 
            results={results} 
            onReset={handleReset}
            clientEmail={clientEmail}
          />
        ) : currentView === 'knowledgeBase' ? (
          <div className="form-container">
            <h2>Upload Knowledge Base</h2>
            <p>Upload your agency knowledge base PDF to enhance AI processing</p>
            
            <KnowledgeBaseUpload 
              onFileUpload={handleKnowledgeBaseUpload} 
              uploadedFile={knowledgeBaseFile}
            />
            
            <div className="form-actions">
              <button 
                className="submit-btn"
                onClick={handleKnowledgeBaseSubmit}
                disabled={!knowledgeBaseFile || isProcessing}
              >
                Update Knowledge Base
              </button>
              
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={handleRetry} className="retry-btn">Retry</button>
                </div>
              )}
              
              {knowledgeBaseSuccess && (
                <div className="success-message">
                  <p>{knowledgeBaseSuccess}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="form-container">
            <div className="tab-navigation">
              <button 
                className={currentView === 'main' ? "tab-btn active" : "tab-btn"}
                onClick={showMainView}
              >
                Process RFP
              </button>
              <button 
                className={currentView === 'knowledgeBase' ? "tab-btn active" : "tab-btn"}
                onClick={showKnowledgeBaseUpload}
              >
                Knowledge Base
              </button>
            </div>
            
            <FileUpload onFileUpload={handleFileUpload} uploadedFile={uploadedFile} />
            
            <ClientInfo 
              clientEmail={clientEmail} 
              setClientEmail={setClientEmail} 
            />
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={handleRetry} className="retry-btn">Retry</button>
              </div>
            )}
            
            {rfpSuccess && (
              <div className="success-message">
                <p>{rfpSuccess}</p>
              </div>
            )}
            
            <div className="form-actions">
              <button 
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!uploadedFile || !clientEmail || isProcessing}
              >
                Process RFP
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>© 2025 EchoVibe Agency. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App