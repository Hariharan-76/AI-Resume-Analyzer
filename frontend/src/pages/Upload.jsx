import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResumeFile, analyzeResumeText } from '../services/resumeService';
import toast from 'react-hot-toast';
import { FileUp, FileText, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';

export const Upload = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const loadingMessages = [
    'Parsing PDF content...',
    'Extracting qualifications and skills...',
    'Consulting Google Gemini AI...',
    'Evaluating ATS keywords & readability...',
    'Analyzing grammatical structure...',
    'Generating actionable improvements...',
  ];

  // Cycle loading text messages while AI runs
  useEffect(() => {
    let interval;
    if (analyzing) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingTextIndex(0);
    }
    return () => clearInterval(interval);
  }, [analyzing]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    // Check if PDF
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed!');
      return;
    }
    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit.');
      return;
    }
    
    setFile(selectedFile);
    toast.success(`${selectedFile.name} ready for parsing.`);
  };

  const handleRemove = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) return;

    try {
      setUploadProgress(10); // initial indicator

      // 1. Upload PDF & Extract Text
      const uploadResult = await uploadResumeFile(file, (progress) => {
        // scale progress up to 90%
        setUploadProgress(Math.min(90, Math.round(progress)));
      });
      
      setUploadProgress(100);
      setAnalyzing(true);

      // 2. Analyze Text with Gemini
      const analysisResult = await analyzeResumeText(
        uploadResult.fileName,
        uploadResult.extractedText
      );

      toast.success('Resume analyzed successfully!');
      navigate(`/analysis/${analysisResult.analysis._id}`);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Error parsing resume. Please try again.';
      toast.error(errMsg);
      setUploadProgress(0);
      setAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="text-center">
        <h1 className="font-outfit text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
          Upload Your Resume
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Upload your resume in PDF format (max 5MB) for a complete ATS and AI analysis.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Loading / Analyzing State */}
        {uploadProgress > 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl glass p-12 text-center shadow-sm">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
              {/* Outer ring */}
              <div className="absolute h-full w-full rounded-full border-4 border-emerald-100 dark:border-emerald-950"></div>
              {/* Spinning action */}
              <div className="absolute h-full w-full rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
              <Sparkles className="h-8 w-8 text-emerald-500 animate-pulse" />
            </div>

            <h3 className="font-outfit text-lg font-bold text-slate-800 dark:text-slate-100">
              {analyzing ? 'Analyzing Resume...' : 'Uploading File...'}
            </h3>
            
            {/* Progress bar */}
            <div className="mt-4 w-full max-w-xs rounded-full bg-slate-200 h-2 dark:bg-dark-900">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-350"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            
            <p className="mt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {analyzing ? loadingMessages[loadingTextIndex] : `Uploading... ${uploadProgress}%`}
            </p>
          </div>
        ) : (
          /* Upload dropzone drag-and-drop */
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-200 cursor-pointer ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10'
                : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50/30 dark:border-dark-800 dark:hover:border-emerald-500'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              accept="application/pdf"
              className="hidden"
            />
            
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
              <FileUp className="h-8 w-8" />
            </div>
            
            <h3 className="mt-6 font-outfit text-lg font-bold text-slate-800 dark:text-slate-100">
              Drag & Drop PDF Resume Here
            </h3>
            
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              or click to browse from files
            </p>

            <div className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-medium text-slate-600 dark:bg-dark-900 dark:text-slate-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Strictly PDF formats supported up to 5 MB.</span>
            </div>
          </div>
        )}

        {/* Selected File Details Card */}
        {file && uploadProgress === 0 && (
          <div className="rounded-2xl border border-slate-200/50 bg-white/70 p-5 shadow-sm dark:border-dark-900/50 dark:bg-dark-900/40 flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 flex-shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate pr-4">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRemove}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:border-dark-800 dark:hover:bg-dark-900"
                title="Remove File"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        {file && uploadProgress === 0 && (
          <button
            onClick={handleUploadAndAnalyze}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-600/10 hover:bg-emerald-500 hover:shadow-emerald-500/20 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition-all duration-200"
          >
            <Sparkles className="h-5 w-5" />
            <span>Analyze Resume with AI</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Upload;
