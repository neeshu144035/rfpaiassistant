import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import './ProposalPackage.css'

const ProposalPackage = ({ packageData }) => {
  const [expandedSections, setExpandedSections] = useState({
    roles: true,
    metrics: true,
    creative: true,
    budget: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Transform roles data for display
  const transformRoles = (roles) => {
    return roles.map(role => `${role.handle} - ${role.role}`)
  }

  // Transform metrics data for display
  const transformMetrics = (metrics) => {
    return [
      `Impressions: ${metrics.impressions || 'N/A'}`,
      `Engagement Rate: ${metrics.engagement_rate || metrics.engagementRate || 'N/A'}`,
      `Clicks: ${metrics.clicks || 'N/A'}`
    ]
  }

  // Transform budget options for display
  const transformBudgetOptions = (options) => {
    return options.map(option => ({
      title: `Option ${option.option}`,
      description: option.description,
      total: option.total
    }))
  }

  return (
    <div className="proposal-package">
      <h2>Draft Proposal Package</h2>
      
      <div className="package-section">
        <div 
          className="section-header" 
          onClick={() => toggleSection('roles')}
        >
          <h3>Recommended Influencers with Roles</h3>
          {expandedSections.roles ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {expandedSections.roles && (
          <div className="section-content">
            {packageData.recommended_roles && packageData.recommended_roles.map((role, index) => (
              <p key={index}>{role.handle} - {role.role}</p>
            ))}
          </div>
        )}
      </div>
      
      <div className="package-section">
        <div 
          className="section-header" 
          onClick={() => toggleSection('metrics')}
        >
          <h3>Expected Metrics</h3>
          {expandedSections.metrics ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {expandedSections.metrics && (
          <div className="section-content">
            <p>Impressions: {packageData.expected_metrics?.impressions || 'N/A'}</p>
            <p>Engagement Rate: {packageData.expected_metrics?.engagement_rate || 'N/A'}</p>
            <p>Clicks: {packageData.expected_metrics?.clicks || 'N/A'}</p>
          </div>
        )}
      </div>
      
      <div className="package-section">
        <div 
          className="section-header" 
          onClick={() => toggleSection('creative')}
        >
          <h3>Creative Angles</h3>
          {expandedSections.creative ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {expandedSections.creative && (
          <div className="section-content">
            {packageData.creative_angles || packageData.creativeAngles ? 
              (packageData.creative_angles || packageData.creativeAngles).map((angle, index) => (
                <p key={index}>{angle}</p>
              )) : 
              <p>No creative angles provided</p>
            }
          </div>
        )}
      </div>
      
      <div className="package-section">
        <div 
          className="section-header" 
          onClick={() => toggleSection('budget')}
        >
          <h3>Budget Allocation Options</h3>
          {expandedSections.budget ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {expandedSections.budget && (
          <div className="section-content budget-options">
            {packageData.budget_options && packageData.budget_options.map((option, index) => (
              <div key={index} className="budget-option">
                <h4>Option {option.option}</h4>
                <p>{option.description}</p>
                <p><strong>Total: {option.total}</strong></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProposalPackage