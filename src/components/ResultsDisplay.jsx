import React, { useState } from 'react'
import { Download } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
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
      
      // Set font
      doc.setFont('helvetica')
      
      // Page 1: Cover Page
      doc.setFillColor(0, 123, 255)
      doc.rect(0, 0, 210, 40, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont(undefined, 'bold')
      doc.text('EchoVibe Agency', 20, 25)
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.setFont(undefined, 'normal')
      doc.text('Proposal for', 20, 60)
      
      doc.setFontSize(18)
      doc.setFont(undefined, 'bold')
      doc.text(clientEmail, 20, 70)
      
      doc.setFontSize(14)
      doc.setFont(undefined, 'normal')
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 90)
      
      doc.setFontSize(16)
      doc.setTextColor(0, 123, 255)
      doc.text('AI-Powered Influencer Marketing', 20, 120)
      
      // Add logo placeholder
      doc.setDrawColor(0, 123, 255)
      doc.rect(170, 15, 20, 20)
      doc.setTextColor(0, 123, 255)
      doc.setFontSize(12)
      doc.text('Logo', 175, 28)
      
      // Start content on page 1 after cover
      let yPos = 140
      
      // RFP Digest
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setTextColor(0, 123, 255)
      doc.setFontSize(20)
      doc.setFont(undefined, 'bold')
      doc.text('RFP Digest', 20, yPos)
      yPos += 15
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.setFont(undefined, 'normal')
      
      // Parse RFP digest summary
      if (results.rfp_digest && results.rfp_digest.summary) {
        const summary = results.rfp_digest.summary
        const splitSummary = doc.splitTextToSize(summary, 170)
        doc.text(splitSummary, 20, yPos)
        yPos += splitSummary.length * 7 + 10
      }
      
      // Influencer Shortlist
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setTextColor(0, 123, 255)
      doc.setFontSize(20)
      doc.setFont(undefined, 'bold')
      doc.text('Influencer Shortlist', 20, yPos)
      yPos += 15
      
      // Create table for influencers
      if (results.influencer_shortlist && results.influencer_shortlist.length > 0) {
        const tableData = results.influencer_shortlist.map(influencer => [
          influencer.handle,
          influencer.tier,
          influencer.followers || 'N/A',
          influencer.engagement_rate || 'N/A',
          influencer.fit_rationale || ''
        ])
        
        autoTable(doc, {
          head: [['Handle', 'Tier', 'Followers', 'Engagement', 'Fit Rationale']],
          body: tableData,
          startY: yPos,
          styles: {
            fontSize: 10,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [0, 123, 255],
            textColor: [255, 255, 255]
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240]
          }
        })
        
        // Get the final Y position after the table
        yPos = doc.lastAutoTable.finalY + 15
      }
      
      // Proposal Package
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setTextColor(0, 123, 255)
      doc.setFontSize(20)
      doc.setFont(undefined, 'bold')
      doc.text('Proposal Package', 20, yPos)
      yPos += 15
      
      // Recommended Roles
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text('Recommended Influencers with Roles', 20, yPos)
      yPos += 10
      
      doc.setFontSize(12)
      doc.setFont(undefined, 'normal')
      
      if (results.proposal_package && results.proposal_package.recommended_roles) {
        results.proposal_package.recommended_roles.forEach((role, index) => {
          doc.text(`${role.handle} - ${role.role}`, 25, yPos)
          yPos += 7
          if (yPos > 280) {
            doc.addPage()
            yPos = 20
          }
        })
        yPos += 10
      }
      
      // Expected Metrics
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text('Expected Metrics', 20, yPos)
      yPos += 10
      
      doc.setFontSize(12)
      doc.setFont(undefined, 'normal')
      
      if (results.proposal_package && results.proposal_package.expected_metrics) {
        const metrics = results.proposal_package.expected_metrics
        doc.text(`Impressions: ${metrics.impressions || 'N/A'}`, 25, yPos)
        yPos += 7
        doc.text(`Engagement Rate: ${metrics.engagement_rate || 'N/A'}`, 25, yPos)
        yPos += 7
        doc.text(`Clicks: ${metrics.clicks || 'N/A'}`, 25, yPos)
        yPos += 10
        if (yPos > 280) {
          doc.addPage()
          yPos = 20
        }
      }
      
      // Creative Angles
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text('Creative Angles', 20, yPos)
      yPos += 10
      
      doc.setFontSize(12)
      doc.setFont(undefined, 'normal')
      
      if (results.proposal_package && results.proposal_package.creative_angles) {
        results.proposal_package.creative_angles.forEach((angle, index) => {
          const splitText = doc.splitTextToSize(angle, 170)
          doc.text(splitText, 25, yPos)
          yPos += splitText.length * 7 + 3
          if (yPos > 280) {
            doc.addPage()
            yPos = 20
          }
        })
        yPos += 10
      }
      
      // Budget Options
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text('Budget Allocation Options', 20, yPos)
      yPos += 10
      
      doc.setFontSize(12)
      doc.setFont(undefined, 'normal')
      
      if (results.proposal_package && results.proposal_package.budget_options) {
        results.proposal_package.budget_options.forEach((option, index) => {
          doc.text(`Option ${option.option}: ${option.description}`, 25, yPos)
          yPos += 7
          doc.text(`Total: ${option.total}`, 30, yPos)
          yPos += 10
          if (yPos > 280) {
            doc.addPage()
            yPos = 20
          }
        })
      }
      
      // Deck Components
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setTextColor(0, 123, 255)
      doc.setFontSize(20)
      doc.setFont(undefined, 'bold')
      doc.text('Client-Ready Deck Components', 20, yPos)
      yPos += 15
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(16)
      doc.setFont(undefined, 'bold')
      doc.text('Executive Summary', 20, yPos)
      yPos += 10
      
      doc.setFontSize(12)
      doc.setFont(undefined, 'normal')
      
      if (results.client_deck_components && results.client_deck_components.executive_summary) {
        const summary = results.client_deck_components.executive_summary
        const splitSummary = doc.splitTextToSize(`"${summary}"`, 170)
        doc.text(splitSummary, 25, yPos)
        yPos += splitSummary.length * 7 + 10
      }
      
      // Compliance & Legal
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setTextColor(0, 123, 255)
      doc.setFontSize(20)
      doc.setFont(undefined, 'bold')
      doc.text('Compliance and Legal', 20, yPos)
      yPos += 15
      
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.setFont(undefined, 'normal')
      
      // Add standard legal text
      const legalText = [
        "All content creators must comply with FTC guidelines and clearly label sponsored content with #Ad tags.",
        "Content rights are granted globally for a period of 12 months from the date of posting.",
        "All deliverables must be submitted in accordance with the agreed timeline.",
        "Payment terms are net 30 days from invoice receipt.",
        "This proposal is valid for 30 days from the date of issue."
      ]
      
      legalText.forEach(line => {
        doc.text(line, 20, yPos)
        yPos += 10
        if (yPos > 280) {
          doc.addPage()
          yPos = 20
        }
      })
      
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