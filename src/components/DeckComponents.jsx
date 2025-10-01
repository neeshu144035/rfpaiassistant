import React from 'react'
import './DeckComponents.css'

const DeckComponents = ({ components }) => {
  // Transform creator cards data for display
  const transformCreatorCards = (cards) => {
    return cards.map(card => {
      const platformInfo = card.platform ? `${card.platform} | ` : ''
      const followersInfo = card.followers ? `${card.followers} | ` : ''
      const engagementInfo = card.engagement_rate ? `Engagement: ${card.engagement_rate}` : ''
      return `${card.handle} - ${platformInfo}${followersInfo}${engagementInfo}`
    })
  }

  return (
    <div className="deck-components">
      <h2>Client-Ready Deck Components</h2>
      
      {components.executive_summary && (
        <div className="deck-section executive-summary">
          <h3>Executive Summary</h3>
          <div className="summary-content">
            <p>"{components.executive_summary}"</p>
          </div>
        </div>
      )}
      
      {components.creator_cards && components.creator_cards.length > 0 && (
        <div className="deck-section">
          <h3>Creator Cards</h3>
          <div className="creator-cards">
            {components.creator_cards.map((card, index) => (
              <div key={index} className="creator-card">
                <h4>{card.handle}</h4>
                <p>Platform: {card.platform || 'N/A'}</p>
                <p>Followers: {card.followers || 'N/A'}</p>
                <p>Engagement Rate: {card.engagement_rate || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {components.timeline && (
        <div className="deck-section">
          <h3>Timeline</h3>
          <div className="timeline">
            <p>{components.timeline}</p>
          </div>
        </div>
      )}
      
      {components.measurement_plan && (
        <div className="deck-section">
          <h3>Measurement Plan</h3>
          <div className="measurement-plan">
            <p>{components.measurement_plan}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeckComponents