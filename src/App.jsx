import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FileDropzone from './components/FileDropzone';
import DocumentViewer from './components/DocumentViewer';
import ExplanationPanel from './components/ExplanationPanel';
import { parsePdf } from './utils/parsePdf';
import { sendToGemini } from './api/gemini';
import LandingPage from './pages/LandingPage';
import FileViewerPage from './pages/FileViewerPage';

const GEMINI_TEXT_PROMPT = `Act as an exam prep assistant. Simplify academic content.\n\nBreak complex concepts into plain lists.\n\nExplain technical terms simply.\n\nCreate 1-2 mnemonics for key concepts.\n\nHighlight essential formulas/theorems.\n\nKeep output under 150 words.\n\nDo not use asterisks anywhere in the output, including for bolding or emphasis.\n\nFormat:\n\nKey Concepts:\n[Start each concept with a 📌 emoji, one per line. Do not use asterisks, dashes, or other bullets.]\n\nSimplified Explanation:\n[Start the paragraph with a 📝 emoji, then write a single concise paragraph. Do not use points, bullets, or asterisks.]\n\nMemory Aids:\n[Start each mnemonic with a 🧠 emoji, one per line. Do not use asterisks, dashes, or other bullets. Do not use asterisks for bolding or emphasis—write mnemonics in plain text only.]\n\nMust-Know:\n[Start each item with a 📖 emoji, one per line. Do not use asterisks, dashes, or other bullets.]\n`;

function App() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [showLanding, setShowLanding] = useState(true);

  const handleFileAccepted = async (file) => {
    setFile(file);
    setPages([]);
    setCurrentPage(1);
    setActiveTab(1);
    setError(null);
    setExplanationError(null);
    setLoading(true);
    try {
      let parsedPages = [];
      if (file.type === 'application/pdf') {
        parsedPages = await parsePdf(file);
      } else {
        throw new Error('Unsupported file type. Only PDF files are allowed.');
      }
      setPages(parsedPages);
      setCurrentPage(1);
      setActiveTab(1);
    } catch (err) {
      setError('Failed to parse document: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimplify = async () => {
    setExplanationError(null);
    setExplanationLoading(true);
    try {
      const page = pages[currentPage - 1];
      const result = await sendToGemini({
        prompt: GEMINI_TEXT_PROMPT,
        content: page.content,
        isImage: false,
      });
      // Use result as needed
    } catch (err) {
      setExplanationError('Gemini API error: ' + err.message);
    } finally {
      setExplanationLoading(false);
    }
  };

  const handleTabClick = (pageNum) => {
    setActiveTab(pageNum);
    setCurrentPage(pageNum);
  };

  return (
    <div className="min-h-screen flex flex-col bg-fire1">
      {/* Header */}
      <header className="bg-fire8 text-fire1 p-4 flex items-center justify-between shadow-md rounded-b-2xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f393.svg" alt="Exam Assistant" className="w-8 h-8" />
          <span className="text-2xl font-bold tracking-tight text-fire1">Exam Assistant</span>
        </div>
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/file-viewer" element={<FileViewerPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App; 