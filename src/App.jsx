import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import ClientInfo from './components/ClientInfo'
import ProcessingAnimation from './components/ProcessingAnimation'
import ResultsDisplay from './components/ResultsDisplay'
import './App.css'

const App = () => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [clientEmail, setClientEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

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

  const handleReset = () => {
    setUploadedFile(null)
    setClientEmail('')
    setResults(null)
    setError(null)
  }
  
  const handleRetry = () => {
    setError(null)
    handleSubmit()
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
        ) : results ? (
          <ResultsDisplay 
            results={results} 
            onReset={handleReset}
            clientEmail={clientEmail}
          />
        ) : (
          <div className="form-container">
            <FileUpload 
              onFileUpload={handleFileUpload} 
              uploadedFile={uploadedFile}
            />
            
            <ClientInfo 
              clientEmail={clientEmail}
              setClientEmail={setClientEmail}
            />
            
            <div className="form-actions">
              <button 
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!uploadedFile || !clientEmail}
              >
                Process RFP
              </button>
              
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={handleRetry} className="retry-btn">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} EchoVibe Agency. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App