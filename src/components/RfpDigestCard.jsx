import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import './RfpDigestCard.css'

const RfpDigestCard = ({ digest }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  // Parse the summary text into key-value pairs
  const parseSummary = (summary) => {
    if (!summary) return {}
    
    // Extract key information from the summary text
    const items = {}
    
    // Extract markets
    const marketsMatch = summary.match(/targeting.*?across\s+([^,]+(?:,\s*[^,]+)*?)\s+primarily/i)
    if (marketsMatch) {
      items.markets = marketsMatch[1]
    }
    
    // Extract languages
    const languagesMatch = summary.match(/languages include\s+([^,.]+)/i)
    if (languagesMatch) {
      items.languages = languagesMatch[1]
    }
    
    // Extract KPIs
    const kpisMatch = summary.match(/KPIs include\s+([^,.]+(?:,\s*[^,.]+)*?)(?=\.)/i)
    if (kpisMatch) {
      items.kpis = kpisMatch[1]
    }
    
    // Extract budget
    const budgetMatch = summary.match(/Total budget is\s+([^\s]+)/i)
    if (budgetMatch) {
      items.budget = budgetMatch[1]
    }
    
    // Extract timeline
    const timelineMatch = summary.match(/Campaign runs from\s+([^,]+(?:,\s*[^,]+)*?)(?=, with)/i)
    if (timelineMatch) {
      items.timeline = timelineMatch[1]
    }
    
    // Extract deliverables
    const deliverablesMatch = summary.match(/deliverables of\s+([^,.]+(?:,\s*[^,.]+)*?)(?=\.)/i)
    if (deliverablesMatch) {
      items.deliverables = deliverablesMatch[1]
    }
    
    // Extract compliance
    const complianceMatch = summary.match(/Compliance with\s+([^,.]+(?:,\s*[^,.]+)*?)(?=\.)/i)
    if (complianceMatch) {
      items.compliance = complianceMatch[1]
    }
    
    // Add the full summary
    items.summary = summary
    
    return items
  }

  const parsedDigest = parseSummary(digest.summary)

  // Format field names for display
  const formatFieldName = (key) => {
    const fieldNames = {
      summary: 'Summary',
      markets: 'Markets',
      languages: 'Languages',
      kpis: 'KPIs',
      budget: 'Budget',
      timeline: 'Timeline',
      deliverables: 'Deliverables',
      compliance: 'Compliance'
    }
    return fieldNames[key] || key.charAt(0).toUpperCase() + key.slice(1)
  }

  // Fields to highlight
  const highlightFields = ['budget', 'kpis']

  return (
    <div className="rfp-digest-card">
      <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h2>RFP Digest</h2>
        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
      
      {isExpanded && (
        <div className="card-content">
          <div className="digest-grid">
            {Object.entries(parsedDigest).map(([key, value]) => (
              <div 
                key={key} 
                className={`digest-item ${highlightFields.includes(key) ? 'highlight' : ''}`}
              >
                <span className="field-name">{formatFieldName(key)}:</span>
                <span className="field-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RfpDigestCard