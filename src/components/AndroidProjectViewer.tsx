import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, AndroidFile } from '../data/androidProjectSource';
import { Download, Copy, Check, FileCode, Folder, Terminal, ArrowLeft, Sparkles, Smartphone } from 'lucide-react';
import JSZip from 'jszip';

interface AndroidProjectViewerProps {
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const AndroidProjectViewer: React.FC<AndroidProjectViewerProps> = ({
  onBack,
  onShowToast,
}) => {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast(`Copied ${selectedFile.name} to clipboard`);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const projectFolder = zip.folder('ReminderHub');

      ANDROID_PROJECT_FILES.forEach((file) => {
        projectFolder?.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ReminderHub-Android-Studio-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast('ReminderHub-Android-Studio-Project.zip downloaded!');
    } catch (err) {
      console.error('Error generating zip:', err);
      alert('Failed to generate project zip.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden text-xs">
      {/* Top Header */}
      <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Back to App"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-white text-sm">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Native Android Source Hub</span>
            </div>
            <span className="text-[10px] text-slate-400">
              Kotlin · Jetpack Compose · Room · WorkManager · com.example.reminderhub
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 1-Click ZIP Download */}
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isZipping ? 'Zipping...' : 'Studio Project (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left File Tree Sidebar */}
        <div className="w-full md:w-64 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0 max-h-48 md:max-h-full overflow-y-auto">
          <div className="p-2.5 font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800/60">
            <Folder className="w-3.5 h-3.5 text-indigo-400" />
            <span>Project Files ({ANDROID_PROJECT_FILES.length})</span>
          </div>

          <div className="p-1.5 space-y-0.5">
            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="truncate text-xs">{file.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Terminal Guide Tip */}
          <div className="p-3 m-2 mt-auto rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1 hidden md:block">
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal APK Build:</span>
            </div>
            <code className="block p-1.5 rounded bg-black/60 text-emerald-300 font-mono text-[10px]">
              ./gradlew assembleDebug
            </code>
            <p className="text-[10px] text-slate-500">
              Output: app/build/outputs/apk/debug/app-debug.apk
            </p>
          </div>
        </div>

        {/* Right Code Display & Guide */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {/* File description toolbar */}
          <div className="p-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div>
              <span className="font-mono text-xs text-indigo-300 font-semibold block">
                {selectedFile.path}
              </span>
              <span className="text-[11px] text-slate-400">
                {selectedFile.description}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition cursor-pointer text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Code text container */}
          <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-[11px] leading-relaxed text-slate-300 selection:bg-indigo-600 selection:text-white">
            <pre className="whitespace-pre-wrap">{selectedFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
