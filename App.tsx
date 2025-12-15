import React, { useState } from 'react';
import { generateStudyModule } from './services/geminiService';
import { StudyModule, KeyConcept } from './types';
import { DataVisualizer } from './components/DataVisualizer';
import { QuizWidget } from './components/QuizWidget';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  BrainCircuit, 
  BarChart2, 
  GraduationCap, 
  ArrowRight,
  Loader2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Aperture
} from 'lucide-react';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StudyModule | null>(null);
  const [expandedConceptIndex, setExpandedConceptIndex] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setExpandedConceptIndex(null);

    try {
      const result = await generateStudyModule(query);
      setData(result);
    } catch (err) {
      setError("Failed to generate study module. Please try again or choose a different topic.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Photosynthesis", "The French Revolution", "Quantum Entanglement", "Supply and Demand", "Shakespeare's Macbeth"
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 group cursor-pointer" 
            onClick={() => window.location.reload()}
            title="Reset Application"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-slate-900 border border-slate-700/50 p-2.5 rounded-xl ring-1 ring-white/10 group-hover:ring-cyan-400/50 transition-all">
                <Aperture className="text-cyan-400 group-hover:rotate-90 transition-transform duration-700 ease-out" size={28} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Sparkles className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" size={10} fill="currentColor" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white leading-none">
                Study<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Lens</span>
              </span>
              <span className="text-[10px] font-extrabold tracking-[0.35em] text-slate-500 group-hover:text-cyan-400 transition-colors uppercase mt-1">
                Intelligent Learning
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search / Hero Section */}
        <div className={`transition-all duration-500 ${data ? 'mb-8' : 'min-h-[60vh] flex flex-col justify-center items-center'}`}>
          {!data && (
            <div className="text-center mb-8 space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Master any topic with <span className="text-cyan-400">AI</span>
              </h1>
              <p className="text-slate-400 text-lg">
                Turn complex subjects into visual dashboards, real-world analogies, and interactive quizzes instantly.
              </p>
            </div>
          )}

          <div className="w-full max-w-2xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <form onSubmit={handleSearch} className="relative flex items-center bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
              <Search className="ml-4 text-slate-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you want to learn today? (e.g., 'Black Holes')"
                className="w-full bg-transparent border-none px-4 py-4 text-lg focus:ring-0 placeholder:text-slate-500 text-white"
              />
              <button 
                type="submit"
                disabled={loading || !query.trim()}
                className="mr-2 bg-slate-800 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
              </button>
            </form>
          </div>

          {!data && !loading && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="text-sm text-slate-500 w-full text-center mb-1">Try asking about:</span>
              {suggestions.map(s => (
                <button 
                  key={s}
                  onClick={() => { setQuery(s); }}
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl max-w-2xl mx-auto text-center">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-slate-800 rounded-2xl"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-40 bg-slate-800 rounded-2xl"></div>
                <div className="h-40 bg-slate-800 rounded-2xl"></div>
              </div>
            </div>
            <div className="h-full bg-slate-800 rounded-2xl min-h-[400px]"></div>
          </div>
        )}

        {/* Results Dashboard */}
        {data && !loading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">{data.topic}</h2>
                <p className="text-xl text-slate-400 max-w-3xl">{data.summary}</p>
              </div>
              <div className="flex items-center gap-2 bg-cyan-900/20 px-4 py-2 rounded-lg border border-cyan-800/30">
                <Sparkles className="text-cyan-400" size={18} />
                <span className="text-cyan-200 font-medium">AI Generated Lesson</span>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Content & Analogy */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Analogy Card */}
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Lightbulb size={120} />
                   </div>
                   <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                         <Lightbulb size={24} />
                       </div>
                       <h3 className="text-xl font-bold text-white">Understanding It Like A...</h3>
                     </div>
                     <h4 className="text-lg font-semibold text-yellow-200 mb-2">{data.analogy.title}</h4>
                     <p className="text-slate-300 leading-relaxed text-lg">
                       {data.analogy.story}
                     </p>
                   </div>
                </div>

                {/* Key Concepts Grid */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="text-cyan-400" /> Key Concepts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    {data.keyConcepts.map((concept, idx) => {
                      const isExpanded = expandedConceptIndex === idx;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => setExpandedConceptIndex(isExpanded ? null : idx)}
                          className={`
                            relative p-5 rounded-xl border transition-all duration-300 cursor-pointer group overflow-hidden
                            ${isExpanded 
                              ? 'bg-slate-800 border-cyan-500/50 shadow-lg ring-1 ring-cyan-500/20' 
                              : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700 hover:border-slate-600'}
                          `}
                        >
                          <div className="absolute top-4 right-4 text-slate-500 group-hover:text-cyan-400 transition-colors">
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                          
                          <div className="flex items-start gap-4 pr-6">
                            <div className="text-3xl flex-shrink-0 mt-1">{concept.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-bold text-lg mb-1 transition-colors ${isExpanded ? 'text-cyan-400' : 'text-white group-hover:text-cyan-200'}`}>
                                {concept.title}
                              </h4>
                              
                              {!isExpanded && (
                                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{concept.description}</p>
                              )}

                              {isExpanded && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 mt-2">
                                  <p className="text-slate-300 leading-relaxed text-sm">{concept.description}</p>
                                  
                                  <div className="bg-cyan-900/10 border border-cyan-500/20 p-3 rounded-lg">
                                    <h5 className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1 flex items-center gap-1">
                                      <Sparkles size={12} /> Real World Example
                                    </h5>
                                    <p className="text-sm text-cyan-100 italic">"{concept.example}"</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Data Visualizer */}
                <div className="glass-panel rounded-2xl p-6 min-h-[400px]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                      <BarChart2 size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Data Lens</h3>
                  </div>
                  <DataVisualizer config={data.chartData} />
                </div>
              </div>

              {/* Right Column: Quiz & Interactive */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel rounded-2xl p-6 h-full flex flex-col bg-gradient-to-b from-slate-800/50 to-slate-900/50">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Knowledge Check</h3>
                      <p className="text-sm text-slate-400">Test your understanding</p>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <QuizWidget questions={data.quiz} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;