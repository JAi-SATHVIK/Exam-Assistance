import React, { useState, useRef } from 'react';
import FileDropzone from '../components/FileDropzone';
import DocumentViewer from '../components/DocumentViewer';
import { parsePdf } from '../utils/parsePdf';
import { sendToGemini } from '../api/gemini';

const GEMINI_TEXT_PROMPT = `Act as an exam prep assistant. Simplify academic content.\n\nBreak complex concepts into plain lists.\n\nExplain technical terms simply.\n\nCreate 1-2 mnemonics for key concepts.\n\nHighlight essential formulas/theorems.\n\nKeep output under 150 words.\n\nDo not use asterisks anywhere in the output, including for bolding or emphasis.\n\nFormat:\n\nKey Concepts:\n[Start each concept with a 📌 emoji, one per line. Do not use asterisks, dashes, or other bullets.]\n\nSimplified Explanation:\n[Start the paragraph with a 📝 emoji, then write a single concise paragraph. Do not use points, bullets, or asterisks.]\n\nMemory Aids:\n[Start each mnemonic with a 🧠 emoji, one per line. Do not use asterisks, dashes, or other bullets. Do not use asterisks for bolding or emphasis—write mnemonics in plain text only.]\n\nMust-Know:\n[Start each item with a 📖 emoji, one per line. Do not use asterisks, dashes, or other bullets.]\n`;

const IMAGE_PROMPT = `You're an exam study assistant. Analyze this educational image.\n\nDescribe all text/diagrams simply.\n\nExtract key concepts with definitions.\n\nCreate 2-3 memory aids.\n\nHighlight critical formulas.\n\nDo not use asterisks anywhere in the output, including for bolding or emphasis.\n\nFormat:\n\nVisual Description:\n[Start the paragraph with a 📝 emoji, then write a single concise paragraph. Do not use points, bullets, or asterisks.]\n\nKey Learnings:\n[Start each learning with a 📌 emoji, one per line. Do not use asterisks, dashes, or other bullets.]\n\nMemory Tricks:\n[Start each mnemonic with a 🧠 emoji, one per line. Do not use asterisks, dashes, or other bullets. Do not use asterisks for bolding or emphasis—write mnemonics in plain text only.]\n\nEssential Formulas:\n[Start each formula with a 📖 emoji, one per line. Do not use asterisks, dashes, or other bullets.]\n`;

const FileViewerPage = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageData, setImageData] = useState(null);
  // AI Simplify state
  const [explanation, setExplanation] = useState('');
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState(null);
  const explanationCache = useRef({});
  const [copied, setCopied] = useState(false);

  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [fitMode, setFitMode] = useState('width'); // 'width' or 'page'

  const handleFileAccepted = async (file) => {
    setFile(file);
    setPages([]);
    setCurrentPage(1);
    setError(null);
    setLoading(true);
    setAiResult('');
    setAiError('');
    setExplanation('');
    setExplanationError(null);
    try {
      let parsedPages = [];
      if (file.type === 'application/pdf') {
        parsedPages = await parsePdf(file);
      } else {
        throw new Error('Unsupported file type. Only PDF files are allowed.');
      }
      setPages(parsedPages);
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to parse document: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageReady = (data) => {
    setImageData(data);
  };

  // --- Simplify logic ---
  const getCacheKey = () => {
    if (!file) return '';
    return `${file.name}_${currentPage}`;
  };

  // Unified Simplify handler
  const handleUnifiedSimplify = async () => {
    setExplanationError(null);
    setExplanationLoading(true);
    setAiError(null);
    setAiLoading(false);
    setCopied(false);
    setAiResult('');
    setExplanation('');
    const cacheKey = getCacheKey();
    if (explanationCache.current[cacheKey]) {
      setExplanation(explanationCache.current[cacheKey]);
      setExplanationLoading(false);
      return;
    }
    try {
      const page = pages[currentPage - 1];
      if (page && page.content && page.content.trim() && !page.needsImage) {
        // Use text
        const result = await sendToGemini({
          prompt: GEMINI_TEXT_PROMPT,
          content: page.content,
          isImage: false,
        });
        setExplanation(result);
        explanationCache.current[cacheKey] = result;
      } else if (imageData) {
        // Use image
        setAiLoading(true);
        const result = await sendToGemini({
          prompt: IMAGE_PROMPT,
          content: imageData.replace(/^data:image\/png;base64,/, ''),
          isImage: true,
        });
        setExplanation(result);
        explanationCache.current[cacheKey] = result;
        setAiLoading(false);
      } else {
        setExplanationError('No text or image found for this page.');
      }
    } catch (err) {
      setExplanationError('error: ' + err.message);
      setAiError('error: ' + err.message);
    } finally {
      setExplanationLoading(false);
      setAiLoading(false);
    }
  };

  const handleCopy = () => {
    if (explanation) {
      navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const page = pages[currentPage - 1];
  const showImageSimplify = page && page.needsImage && imageData;

  // Navigation controls moved to sidebar
  const totalPages = pages.length;
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleJump = (e) => {
    e.preventDefault();
    const num = parseInt(e.target.elements.jump.value, 10);
    if (num >= 1 && num <= totalPages) setCurrentPage(num);
  };
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.3));
  const handleFitToWidth = () => setFitMode('width');
  const handleFitToPage = () => setFitMode('page');

  return (
    <div className="flex min-h-[80vh] bg-gradient-to-r from-fire1 via-fire3 to-fire7">
      {/* Main Viewer Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-0">
        <div className="w-full bg-fire1 rounded-2xl shadow-2xl min-h-[700px] flex flex-col items-center justify-center border-4 border-fire2">
          {!file ? (
            <FileDropzone onFileAccepted={handleFileAccepted} />
          ) : loading ? (
            <div className="text-fire8 text-lg font-bold">Parsing document...</div>
          ) : error ? (
            <div className="text-fire5 text-lg font-bold">{error}</div>
          ) : (
            <>
              {/* Sticky navigation bar at the top */}
              <div className="w-full flex items-center justify-center gap-4 mb-4 sticky top-0 bg-gradient-to-r from-fire2 via-fire4 to-fire6 z-20 py-4 shadow-lg rounded-t-2xl" style={{ position: 'sticky', top: 0 }}>
                <button
                  className="p-2 rounded-full bg-fire3 hover:bg-fire5 text-xl text-fire9 shadow-md transition"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <span aria-hidden="true">&#8592;</span>
                </button>
                <span className="text-lg font-bold text-fire9 px-4 py-1 rounded shadow-inner bg-fire6/80">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="p-2 rounded-full bg-fire3 hover:bg-fire5 text-xl text-fire9 shadow-md transition"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <span aria-hidden="true">&#8594;</span>
                </button>
                {/* Zoom and fit controls */}
                <div className="flex items-center gap-2 ml-6">
                  <button
                    className={`p-2 rounded-full shadow ${fitMode === 'width' ? 'bg-fire8 text-fire1' : 'bg-fire2 hover:bg-fire4 text-fire9'}`}
                    onClick={handleFitToWidth}
                    aria-label="Fit to width"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="8" width="16" height="8" rx="2" strokeWidth="2" /><path d="M8 12h8" strokeWidth="2" /></svg>
                  </button>
                  <button
                    className={`p-2 rounded-full shadow ${fitMode === 'page' ? 'bg-fire8 text-fire1' : 'bg-fire2 hover:bg-fire4 text-fire9'}`}
                    onClick={handleFitToPage}
                    aria-label="Fit to page"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /></svg>
                  </button>
                  <button
                    className="p-2 rounded-full bg-fire3 hover:bg-fire5 text-xl text-fire9 shadow-md transition"
                    onClick={handleZoomOut}
                    aria-label="Zoom out"
                  >
                    <span aria-hidden="true">-</span>
                  </button>
                  <span className="w-10 text-center text-base font-bold text-fire9 bg-fire6/80 rounded">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    className="p-2 rounded-full bg-fire3 hover:bg-fire5 text-xl text-fire9 shadow-md transition"
                    onClick={handleZoomIn}
                    aria-label="Zoom in"
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
              </div>
              <DocumentViewer
                pages={pages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                file={file}
                onImageReady={handleImageReady}
                zoom={zoom}
                fitMode={fitMode}
              />
              {/* Unified Simplify Button and Result */}
              <div className="w-full flex flex-col items-center mt-6">
                <button
                  className="px-6 py-2 bg-fire8 text-fire1 rounded shadow-lg hover:bg-fire9 transition mb-2 font-bold text-lg border-2 border-fire6"
                  onClick={handleUnifiedSimplify}
                  disabled={explanationLoading || aiLoading}
                >
                  {(explanationLoading || aiLoading) ? 'Simplifying...' : 'Simplify'}
                </button>
                {(explanationError || aiError) && <div className="text-fire5 mb-2 font-bold">{explanationError || aiError}</div>}
                {explanation && (
                  <div className="w-full bg-fire9/80 border border-fire8 rounded-xl p-4 mt-2 whitespace-pre-wrap text-left shadow-lg">
                    <div className="font-bold mb-2 text-fire1">AI Simplified Notes:</div>
                    {explanation}
                    <div className="flex gap-2 mt-4">
                      <button
                        className="px-4 py-2 bg-fire2 text-fire9 rounded shadow hover:bg-fire4 hover:text-fire8 disabled:opacity-50"
                        onClick={handleCopy}
                        disabled={explanationLoading || aiLoading}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Page numbers at the bottom (no 'Page X of Y' or 'out of pages') */}
              <div className="w-full flex items-center justify-center gap-1 mt-8 flex-wrap">
                {pages.map((p, idx) => (
                  <button
                    key={p.pageNumber}
                    className={`w-8 h-8 rounded-lg border-2 text-base flex items-center justify-center transition-all mx-0.5 font-bold shadow ${currentPage === idx + 1 ? 'bg-fire8 text-fire1 border-fire6' : 'bg-fire2 text-fire9 border-fire3 hover:bg-fire6 hover:text-fire1'}`}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default FileViewerPage; 