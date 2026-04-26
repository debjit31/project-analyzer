import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Upload } from 'lucide-react';
import { DropZone } from '../features/resume/DropZone';
import { ATSScoreRing } from '../features/resume/ATSScoreRing';
import { FeedbackPanel } from '../features/resume/FeedbackPanel';
import { useToast } from '../lib/ToastContext';

const ResumeAnalyzerPage = () => {
  const { push } = useToast();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [score] = useState(82);

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2200));
    setAnalyzing(false);
    setAnalyzed(true);
    push({ message: `Resume analyzed — ATS Score: ${score}/100`, variant: 'success' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-50 font-[family-name:var(--font-heading)] flex items-center gap-2">
          <FileText className="w-6 h-6 text-teal-400" />
          Resume Analyzer
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Upload your resume to get an ATS compatibility score and actionable feedback
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Upload */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-neutral-400" />
              Upload Resume
            </h2>
            <DropZone onFile={setFile} />

            {file && !analyzed && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleAnalyze}
                disabled={analyzing}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-70 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-teal-900/30"
              >
                {analyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze with AI
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Tips */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Pro Tips</h3>
            <ul className="space-y-2.5">
              {[
                'Use standard section headings (Experience, Skills, Education)',
                'Include job-specific keywords from the description',
                'Keep formatting simple — no tables or columns',
                'Quantify achievements with numbers when possible',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-500">
                  <span className="mt-2 w-1 h-1 rounded-full bg-teal-500 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!analyzed ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-96 bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500/20 to-violet-500/10 border border-neutral-700 flex items-center justify-center mb-5">
                  <FileText className="w-10 h-10 text-neutral-600" />
                </div>
                <h3 className="text-neutral-400 font-semibold mb-2">Upload your resume to get started</h3>
                <p className="text-sm text-neutral-600 max-w-xs leading-relaxed">
                  Our AI will analyze your resume for ATS compatibility and provide section-by-section feedback
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                {/* Score card */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <ATSScoreRing score={score} />
                    <div className="flex-1">
                      <h2 className="text-base font-bold text-neutral-100 mb-3">Score Breakdown</h2>
                      <div className="space-y-3">
                        {[
                          { label: 'Keywords Match', value: 78, color: 'bg-teal-500' },
                          { label: 'Formatting', value: 92, color: 'bg-emerald-500' },
                          { label: 'Skills Section', value: 85, color: 'bg-violet-500' },
                          { label: 'Experience', value: 70, color: 'bg-amber-500' },
                        ].map(({ label, value, color }) => (
                          <div key={label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-neutral-400">{label}</span>
                              <span className="text-neutral-300 font-medium">{value}%</span>
                            </div>
                            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                                className={`h-full rounded-full ${color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                  <FeedbackPanel />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;

