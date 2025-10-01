import React from 'react'
import { Mail } from 'lucide-react'
import './ClientInfo.css'

const ClientInfo = ({ clientEmail, setClientEmail }) => {
  return (
    <div className="client-info">
      <h2>Contact Information</h2>
      <div className="input-group">
        <label htmlFor="email">Email Address</label>
        <div className="input-wrapper">
          <Mail size={20} className="input-icon" />
          <input
            type="email"
            id="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>
    </div>
  )
}

export default ClientInfo