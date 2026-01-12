
import React, { useState } from 'react';
import { optimizeResume } from './services/geminiService';
import { exportToDocx } from './services/docxExport';
import { ResumeData, OptimizationResult, ResumeTemplate } from './types';
import { 
  FileText, 
  Briefcase, 
  Target, 
  Download, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Layout,
  Layers,
  Award,
  Columns,
  ShieldCheck,
  Zap,
  CheckCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<ResumeTemplate>('standard');

  const handleOptimize = async () => {
    if (!resumeText || !jobDescription) {
      setError('Please provide both your current resume and the job description.');
      return;
    }

    setIsOptimizing(true);
    setError(null);
    try {
      const optimizationResult = await optimizeResume(resumeText, jobDescription);
      setResult(optimizationResult);
      setStep(3);
    } catch (err) {
      setError('Failed to optimize resume. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      exportToDocx(result.optimizedResume, template);
    }
  };

  const templates: { id: ResumeTemplate; name: string; desc: string; icon: any; isSafe: boolean }[] = [
    { id: 'standard', name: 'MNC Standard', desc: '100% ATS Safe - Recommended', icon: ShieldCheck, isSafe: true },
    { id: 'two-column', name: 'Professional Two-Column', desc: 'Recruiter Favorite', icon: Columns, isSafe: false },
    { id: 'modern', name: 'Modern Tech', desc: 'Startup Friendly', icon: Layout, isSafe: false },
    { id: 'minimalist', name: 'Minimalist', desc: 'Elegant & Simple', icon: Layers, isSafe: true },
  ];

  const atsChecklist = [
    "Standard font utilized",
    "Keywords from Job Description integrated",
    "STAR-based achievement bullets",
    "Standard section headers used",
    "Clean, parseable layout selected"
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">ATS Resume Mastery</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className={step >= 1 ? 'text-blue-600' : ''}>Configure</span>
              <ChevronRight className="w-4 h-4" />
              <span className={step >= 3 ? 'text-blue-600' : ''}>Optimize for 100% Match</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
                <Zap className="w-3 h-3" /> Targeted Optimization
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-5xl">
                Get Your 100% ATS Match
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Our advanced AI analyzes job descriptions to insert critical keywords and reformat your experience for maximum compatibility.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-800">Step 1: Paste Your Resume</h3>
                </div>
                <textarea
                  className="w-full h-[350px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm leading-relaxed"
                  placeholder="Paste your existing resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-800">Step 2: Paste Job Description</h3>
                </div>
                <textarea
                  className="w-full h-[350px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm leading-relaxed"
                  placeholder="Paste the target job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 max-w-lg mx-auto">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <button
                onClick={handleOptimize}
                disabled={isOptimizing || !resumeText || !jobDescription}
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-5 px-16 rounded-2xl shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all transform active:scale-95 text-xl"
              >
                {isOptimizing ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    Calculating 100% Match...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Optimize Now
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 space-y-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Edit Inputs
                </button>

                {/* ATS 100% Checklist */}
                <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg border border-blue-800">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    ATS Optimization Checklist
                  </h3>
                  <div className="space-y-3">
                    {atsChecklist.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-100">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Template Selection */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Format Selection
                  </h3>
                  <div className="space-y-2">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={`w-full flex items-start gap-4 p-3 rounded-xl border-2 transition-all text-left ${
                          template === t.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${template === t.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <t.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`font-bold text-xs truncate ${template === t.id ? 'text-blue-900' : 'text-slate-800'}`}>{t.name}</p>
                            {t.isSafe && <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-black uppercase">Safest</span>}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{t.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ATS Score Visualization */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-black text-blue-600 tabular-nums">{result.atsScore}%</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Match Optimization Score</div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${result.atsScore > 90 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                      style={{ width: `${result.atsScore}%` }}
                    />
                  </div>
                  <hr className="border-slate-100" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <Target className="w-3 h-3 text-blue-500" /> Key Keywords Matched
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.matchedKeywords.slice(0, 15).map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded border border-emerald-100 uppercase">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 px-6 rounded-2xl shadow-2xl transition-all transform active:scale-95 text-lg"
                >
                  <Download className="w-6 h-6" />
                  Download ATS Ready DOCX
                </button>
              </div>

              {/* Preview Display */}
              <div className="lg:w-2/3">
                <div className={`bg-white rounded-xl border border-slate-200 shadow-2xl p-8 sm:p-16 min-h-[1056px] text-slate-900 relative ${template === 'minimalist' ? 'font-serif' : 'font-sans'}`}>
                  {/* Watermark for previewing */}
                  <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest border border-slate-200 px-2 py-1 rounded">ATS Optimized Preview</div>
                  
                  {template === 'two-column' ? (
                    <div className="space-y-10">
                      <div className="flex justify-between items-start gap-12 border-b border-slate-100 pb-10">
                        <div className="flex-1">
                          <h1 className="text-5xl font-bold tracking-tighter mb-2">{result.optimizedResume.personalInfo.fullName}</h1>
                          <p className="text-2xl font-bold text-slate-800 mb-6 uppercase tracking-tight">{result.optimizedResume.experience[0]?.role || 'Professional'}</p>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">{result.optimizedResume.summary}</p>
                        </div>
                        <div className="text-right text-[11px] space-y-1.5 font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
                          <p>{result.optimizedResume.personalInfo.location}</p>
                          <p>{result.optimizedResume.personalInfo.phone}</p>
                          <p className="text-blue-600">{result.optimizedResume.personalInfo.email}</p>
                          {result.optimizedResume.personalInfo.linkedin && <p className="truncate max-w-[150px]">{result.optimizedResume.personalInfo.linkedin}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-12">
                        <div className="col-span-8 space-y-10">
                          <section>
                            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-2">Experience</h2>
                            <div className="space-y-10">
                              {result.optimizedResume.experience.map((exp, i) => (
                                <div key={i} className="relative pl-4 border-l border-slate-100">
                                  <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="font-bold text-xl text-slate-900">{exp.company}</h3>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exp.startDate} – {exp.endDate}</span>
                                  </div>
                                  <p className="text-sm font-black text-blue-700 mb-4 uppercase tracking-wide">{exp.role}</p>
                                  <ul className="list-disc pl-5 space-y-3 text-sm text-slate-700 leading-snug font-medium">
                                    {exp.description.map((bullet, bi) => <li key={bi}>{bullet}</li>)}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </section>
                        </div>
                        <div className="col-span-4 space-y-10">
                          <section>
                            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-2">Top Skills</h2>
                            <div className="flex flex-col gap-3">
                              {result.optimizedResume.skills.map((skill, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{skill}</span>
                                </div>
                              ))}
                            </div>
                          </section>
                          <section>
                            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-2">Education</h2>
                            <div className="space-y-8">
                              {result.optimizedResume.education.map((edu, i) => (
                                <div key={i}>
                                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight">{edu.school}</h3>
                                  <p className="text-[11px] text-slate-600 font-bold mt-1">{edu.degree}</p>
                                  <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{edu.graduationDate}</p>
                                </div>
                              ))}
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 max-w-[800px] mx-auto">
                      <div className={`mb-10 border-b border-slate-100 pb-8 ${template === 'standard' ? 'text-center' : 'text-left'}`}>
                        <h2 className={`font-black tracking-tighter leading-none ${template === 'modern' ? 'text-5xl text-blue-600' : 'text-4xl uppercase'}`}>
                          {result.optimizedResume.personalInfo.fullName}
                        </h2>
                        <div className={`text-[11px] font-bold text-slate-500 mt-4 uppercase tracking-widest flex flex-wrap gap-2 ${template === 'standard' ? 'justify-center' : ''}`}>
                          <span>{result.optimizedResume.personalInfo.email}</span>
                          <span>•</span>
                          <span>{result.optimizedResume.personalInfo.phone}</span>
                          <span>•</span>
                          <span>{result.optimizedResume.personalInfo.location}</span>
                        </div>
                      </div>

                      <section>
                        <h3 className={`text-xs font-black uppercase tracking-[0.4em] pb-2 mb-6 ${template === 'standard' ? 'border-b-2 border-slate-900' : 'text-blue-600 border-b border-slate-100'}`}>Professional Summary</h3>
                        <p className="text-slate-700 text-sm leading-relaxed font-medium">{result.optimizedResume.summary}</p>
                      </section>

                      <section>
                        <h3 className={`text-xs font-black uppercase tracking-[0.4em] pb-2 mb-6 ${template === 'standard' ? 'border-b-2 border-slate-900' : 'text-blue-600 border-b border-slate-100'}`}>Experience</h3>
                        <div className="space-y-10">
                          {result.optimizedResume.experience.map((exp, i) => (
                            <div key={i}>
                              <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-black text-lg text-slate-900 uppercase tracking-tight">{exp.company}</h4>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{exp.startDate} – {exp.endDate}</span>
                              </div>
                              <p className="text-sm text-blue-700 font-black uppercase tracking-widest mb-4">{exp.role}</p>
                              <ul className="mt-4 list-disc pl-6 space-y-3 text-slate-700 text-sm font-medium">
                                {exp.description.map((bullet, bi) => <li key={bi} className="leading-snug">{bullet}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h3 className={`text-xs font-black uppercase tracking-[0.4em] pb-2 mb-6 ${template === 'standard' ? 'border-b-2 border-slate-900' : 'text-blue-600 border-b border-slate-100'}`}>Skills & Expertise</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                          {result.optimizedResume.skills.map((skill, i) => (
                            <div key={i} className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                              {skill}
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-20 py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Optimized for 100% ATS Compatibility</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
