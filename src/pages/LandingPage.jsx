import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-fire1 min-h-[80vh]">
      <div className="max-w-xl mx-auto bg-fire2 rounded-2xl shadow-2xl p-10 mt-12 flex flex-col items-center border-4 border-fire3">
        <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4da.svg" alt="Books" className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold mb-2 text-fire9 drop-shadow">Exam Assistant</h1>
        <p className="mb-4 text-fire8 text-lg font-medium">
          Upload your <span className="font-bold text-fire9">PDF study notes</span> and instantly get <span className="font-bold text-fire9">AI-powered, exam-focused explanations</span> for each page. Navigate, zoom, and simplify your material for fast, effective revision!
        </p>
        <ul className="mb-6 text-left text-fire8 list-disc list-inside text-base">
          <li>Upload and view your PDF study material</li>
          <li>Navigate and zoom through pages with modern controls</li>
          <li>Click <span className="font-semibold text-fire9">Simplify</span> on any page for instant AI notes</li>
          <li>Copy, export, and review all results</li>
        </ul>
        <button
          className="px-8 py-3 bg-fire8 text-fire1 rounded-lg text-lg font-semibold shadow hover:bg-fire9 hover:text-fire2 transition mt-2 border-2 border-fire7"
          onClick={() => navigate('/file-viewer')}
        >
          Get Started
        </button>
      </div>
    </main>
  );
};

export default LandingPage; 