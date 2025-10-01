import React, { useState } from 'react'
import './InfluencerTable.css'

const InfluencerTable = ({ influencers }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Transform the influencer data to match what the table expects
  const transformInfluencers = (influencers) => {
    return influencers.map(influencer => ({
      handle: influencer.handle,
      tier: influencer.tier,
      followers: influencer.followers || 'N/A',
      engagement: influencer.engagement_rate || 'N/A',
      notes: influencer.fit_rationale || influencer.notes || ''
    }))
  }

  const transformedInfluencers = transformInfluencers(influencers)

  const sortedInfluencers = [...transformedInfluencers]
  if (sortConfig.key) {
    sortedInfluencers.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const getTierClass = (tier) => {
    if (tier.includes('macro') || tier.includes('Macro')) return 'tier-macro'
    if (tier.includes('mid') || tier.includes('Mid')) return 'tier-mid'
    if (tier.includes('micro') || tier.includes('Micro')) return 'tier-micro'
    return ''
  }

  return (
    <div className="influencer-table-container">
      <h2>Influencer Shortlist</h2>
      <div className="table-wrapper">
        <table className="influencer-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('handle')}>
                Handle
                {sortConfig.key === 'handle' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => handleSort('tier')}>
                Tier
                {sortConfig.key === 'tier' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => handleSort('followers')}>
                Followers
                {sortConfig.key === 'followers' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => handleSort('engagement')}>
                Engagement
                {sortConfig.key === 'engagement' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th>Fit Rationale</th>
            </tr>
          </thead>
          <tbody>
            {sortedInfluencers.map((influencer, index) => (
              <tr key={index}>
                <td>{influencer.handle}</td>
                <td>
                  <span className={`tier-badge ${getTierClass(influencer.tier)}`}>
                    {influencer.tier}
                  </span>
                </td>
                <td>{influencer.followers}</td>
                <td>{influencer.engagement}</td>
                <td className="notes-cell">{influencer.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InfluencerTable