import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_SIZE = 15 * 1024 * 1024; // 15MB
const ACCEPTED_TYPES = [
  'application/pdf',
];

function FileDropzone({ onFileAccepted }) {
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError(null);
    if (fileRejections.length > 0) {
      const reason = fileRejections[0].errors[0].message;
      setError(reason);
      return;
    }
    const file = acceptedFiles[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Invalid file type. Only PDF files are allowed.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('File is too large. Maximum size is 15MB.');
      return;
    }
    onFileAccepted(file);
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: MAX_SIZE,
  });

  return (
    <div className="mx-auto my-12 max-w-md w-full p-8 border-4 border-fire8 bg-fire2 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center cursor-pointer" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-fire9 font-bold">Drop the file here ...</p>
      ) : (
        <p className="text-fire9 font-semibold">Drag & drop a PDF file here, or click to select (max 15MB)</p>
      )}
      {error && <p className="text-fire5 mt-2 font-bold">{error}</p>}
    </div>
  );
}

export default FileDropzone; 