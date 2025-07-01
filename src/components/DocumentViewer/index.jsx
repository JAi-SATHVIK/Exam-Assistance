import React, { useState, useEffect, useRef } from 'react';
import { getPdfPageImage } from '../../utils/parsePdf';

function DocumentViewer({ pages, currentPage, file, onImageReady, zoom = 1, fitMode = 'width', onZoomChange, onFitModeChange }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const imageRef = useRef(null);

  const page = pages && pages.length > 0 ? pages[currentPage - 1] : null;

  // PDF image extraction effect (always for PDFs)
  useEffect(() => {
    let isMounted = true;
    if (page && page.type === 'pdf' && file) {
      setImageLoading(true);
      getPdfPageImage(page.pageNumber, file)
        .then(url => {
          if (isMounted) setImageUrl(url);
          if (onImageReady) onImageReady(url);
        })
        .catch(() => {
          if (isMounted) setImageUrl(null);
          if (onImageReady) onImageReady(null);
        })
        .finally(() => {
          if (isMounted) setImageLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [page, file]);

  if (!pages || pages.length === 0) {
    return <div className="text-gray-400">No pages to display.</div>;
  }

  // Set up container and image styles for fit modes
  let containerStyle = { minHeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', width: '100%' };
  let imgStyle = { display: 'block', margin: '0 auto', transition: 'transform 0.2s' };

  if (fitMode === 'width') {
    imgStyle.width = '100%';
    imgStyle.height = 'auto';
    imgStyle.maxHeight = 800 * zoom;
  } else if (fitMode === 'page') {
    // A4 aspect ratio: 1:1.414 (e.g., 800px x 1131px)
    containerStyle = {
      ...containerStyle,
      aspectRatio: '1 / 1.414',
      height: `${800 * zoom}px`,
      maxHeight: `${800 * zoom}px`,
      maxWidth: 'calc(800px * 1.414)',
      width: 'auto',
      justifyContent: 'center',
      alignItems: 'center',
    };
    imgStyle.width = '100%';
    imgStyle.height = '100%';
    imgStyle.objectFit = 'contain';
    imgStyle.maxHeight = '100%';
    imgStyle.maxWidth = '100%';
  } else {
    imgStyle.transform = `scale(${zoom})`;
    imgStyle.maxHeight = 800 * zoom;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="border rounded p-4" style={containerStyle}>
        {/* PDF: Always show rendered image */}
        {page.type === 'pdf' && file ? (
          imageLoading ? (
            <div className="text-blue-500">Rendering PDF page...</div>
          ) : imageUrl ? (
            <img
              ref={imageRef}
              src={imageUrl}
              alt={`PDF page ${page.pageNumber}`}
              className="object-contain mx-auto"
              style={imgStyle}
            />
          ) : (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4 text-center w-full max-w-md">
              <div className="font-bold mb-1">Failed to render PDF image.</div>
              <div className="text-sm">This may be due to a complex or unsupported PDF layout.<br/>Try uploading a simpler PDF, or check if the file is corrupted.</div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="text-5xl mb-2">📄</div>
            <div className="text-gray-500 text-lg">Preview not supported for this file type.<br/>Please upload a PDF file.</div>
          </div>
        )}
      </div>
      {/* Page number indicator below preview */}
      <div className="mt-2 text-sm text-gray-500">Page {page.pageNumber} of {pages.length}</div>
    </div>
  );
}

export default DocumentViewer; 