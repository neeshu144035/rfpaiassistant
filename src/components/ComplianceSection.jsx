import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import './ComplianceSection.css'

const ComplianceSection = ({ compliance }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="compliance-section">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h2>Compliance and Legal</h2>
        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
      
      {isExpanded && (
        <div className="section-content">
          <ul>
            {compliance.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ComplianceSection