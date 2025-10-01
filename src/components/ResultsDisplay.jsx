import React, { useState } from 'react'
import { Download } from 'lucide-react'
import jsPDF from 'jspdf'
import RfpDigestCard from './RfpDigestCard'
import InfluencerTable from './InfluencerTable'
import ProposalPackage from './ProposalPackage'
import DeckComponents from './DeckComponents'
// import ComplianceSection from './ComplianceSection'
import './ResultsDisplay.css'

const ResultsDisplay = ({ results, onReset, clientEmail }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF()
      
      // Add content to PDF (simplified for now)
      doc.setFontSize(22)
      doc.setTextColor(0, 123, 255)
      doc.text('EchoVibe Agency Proposal', 20, 20)
      
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text(`Proposal for ${clientEmail}`, 20, 40)
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50)
      
      // Add more content based on results...
      
      // Save the PDF
      doc.save(`echovibe-proposal-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // The n8n webhook sends data in a different structure
  // We need to adapt to the new structure:
  // results = {
  //   rfp_digest: {...},
  //   influencer_shortlist: [...],
  //   proposal_package: {...},
  //   client_deck_components: {...}
  // }

  return (
    <div className="results-display">
      <div className="results-header">
        <h1>RFP Analysis Results</h1>
        <button 
          className="download-btn"
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
        >
          <Download size={20} />
          {isGeneratingPDF ? 'Generating...' : 'Download Proposal PDF'}
        </button>
      </div>
      
      <div className="results-content">
        {results.rfp_digest && (
          <RfpDigestCard digest={results.rfp_digest} />
        )}
        
        {results.influencer_shortlist && results.influencer_shortlist.length > 0 && (
          <InfluencerTable influencers={results.influencer_shortlist} />
        )}
        
        {results.proposal_package && (
          <ProposalPackage packageData={results.proposal_package} />
        )}
        
        {results.client_deck_components && (
          <DeckComponents components={results.client_deck_components} />
        )}
        
        {/* {results.compliance && results.compliance.length > 0 && (
          <ComplianceSection compliance={results.compliance} />
        )} */}
      </div>
      
      <div className="results-actions">
        <button className="reset-btn" onClick={onReset}>
          Process Another RFP
        </button>
      </div>
    </div>
  )
}

export default ResultsDisplay