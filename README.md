# EchoVibe Agency - AI RFP Assistant

A professional web application that enables clients to upload PDF RFPs, process them through an n8n workflow, and receive beautifully formatted proposals with PDF download capability.

## Features

- **PDF Upload Interface**: Drag-and-drop file uploader with validation (PDF only, <10MB)
- **Client Information Collection**: Email input with validation
- **Webhook Integration**: Communicates with n8n workflow
- **Processing Animation**: Visual feedback during processing
- **Response Parsing Engine**: Parses structured text into organized sections
- **Results Display**: Card-based interface with collapsible sections
- **PDF Download**: Generates and downloads professional proposals

## Technology Stack

- **Frontend**: React with hooks
- **Styling**: CSS Modules
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Build Tool**: Vite

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── FileUpload.jsx
│   ├── ClientInfo.jsx
│   ├── ProcessingAnimation.jsx
│   ├── ResultsDisplay.jsx
│   ├── RfpDigestCard.jsx
│   ├── InfluencerTable.jsx
│   ├── ProposalPackage.jsx
│   ├── DeckComponents.jsx
│   └── ComplianceSection.jsx
├── App.jsx
├── main.jsx
├── App.css
└── index.css
```

## Development

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and sign up/sign in
3. Click "New Project" and import your GitHub repository
4. Vercel will automatically detect the project settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy" and your site will be live within minutes!

### Environment Variables

If you need to configure any environment variables for your deployment, you can add them in the Vercel project settings under "Environment Variables".

## Design System

### Colors
- Primary Blue: #007BFF
- Light Blue: #E3F2FD
- Success Green: #28A745
- Warning Orange: #FFA500
- Error Red: #DC3545
- Text Dark: #212529
- Text Light: #6C757D
- Background: #F8F9FA
- White: #FFFFFF

### Typography
- Headings: 700 weight
- Body: 400 weight
- Monospace: 'Courier New'

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## API Integration

The application integrates with an n8n webhook:
- **Endpoint**: https://n8n.srv1020266.hstgr.cloud/webhook/4ef0c32e-879c-4d0f-9b38-0edebfb78ddb
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Timeout**: 90 seconds