# Exam Assistant Web App

## Tech Stack
- **Frontend:** React.js + Tailwind CSS
- **Document Parsing:** pdf-lib.js (PDF)
- **AI Engine:** Gemini API (free tier)
- **Hosting:** Vercel (free tier)
- **UI Components:** react-dropzone, react-pdf

## Core Functionality Workflow
- File upload and processing (PDF only)
- Document viewer with navigation and zoom
- Explanation panel with AI-powered simplification
- Gemini API integration for text/image analysis
- Error handling and user feedback

## Project Structure
```
Exam-Assistant/
│
├── public/                  # Static assets
│   └── ...
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DocumentViewer/
│   │   ├── ExplanationPanel/
│   │   ├── FileDropzone/
│   │   └── ...
│   ├── utils/               # Utility functions (parsing, API, etc.)
│   ├── api/                 # Gemini API integration
│   ├── App.jsx              # Main app entry
│   ├── index.js             # React entry point
│   └── index.css            # Tailwind CSS imports
├── .env                     # Environment variables (Gemini API key)
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config
├── package.json             # Project dependencies and scripts
└── README.md                # Project overview (this file)
```

## Setup
1. Clone the repo
2. Install dependencies: `npm install`
3. Add your Gemini API key to `.env`
4. Run locally: `npm run dev`
5. Deploy on Vercel (free tier)

---

Proceed to implement the file structure as described above. 