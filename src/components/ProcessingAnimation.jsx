import React from 'react'
import './ProcessingAnimation.css'

const ProcessingAnimation = () => {
  return (
    <div className="processing-container">
      <div className="spinner"></div>
      <h2>Processing your RFP...</h2>
      <p>This may take up to 60 seconds</p>
    </div>
  )
}

export default ProcessingAnimation