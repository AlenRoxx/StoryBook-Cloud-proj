import React, { useEffect, useMemo, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const PDF_PAGE_WIDTH = 1200;
const PDF_PAGE_HEIGHT = 800;

const LOADING_MESSAGES = [
  'Summoning your storyworld...',
  'Weaving narrative threads...',
  'Painting scenes with starlight...',
  'Sketching characters into being...',
  'Binding pages with a touch of magic...',
  'Polishing the final illustrations...',
];

/* ---------------------------------------------------------------------- */
/* Ambient background                                                      */
/* ---------------------------------------------------------------------- */

function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0b0a1f] -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 opacity-40 blur-3xl animate-meshDrift" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-tr from-purple-900 via-pink-700 to-rose-600 opacity-30 blur-3xl animate-meshDriftReverse" />
      <div className="absolute top-[30%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-b from-violet-700 to-indigo-900 opacity-30 blur-3xl animate-meshDrift" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0b0a1f_85%)]" />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Input state                                                             */
/* ---------------------------------------------------------------------- */

function InputPanel({ userPrompt, setUserPrompt, onSubmit, animationClass }) {
  return (
    <div className={`w-full max-w-2xl ${animationClass}`}>
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-shimmer mb-3">
          AI Storyteller
        </h1>
        <p className="text-purple-200/60 text-sm sm:text-base">
          Describe a world. Watch it come to life, page by page.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="glass-panel glow-border-focus rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-500"
      >
        <textarea
          className="w-full bg-black/20 rounded-2xl p-4 text-purple-50 placeholder-purple-300/40 border border-white/10 outline-none resize-none transition-all duration-300 focus:bg-black/30 focus:border-fuchsia-400/40 focus:shadow-[0_0_24px_rgba(217,70,239,0.25)]"
          rows="4"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Enter a theme for your story (e.g., 'A lost robot in a magical forest')"
          required
        />
        <button
          type="submit"
          disabled={!userPrompt.trim()}
          className="neon-hover mt-5 w-full sm:w-auto sm:px-10 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          ✨ Create Storybook
        </button>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Loading state — magic wand sequence                                    */
/* ---------------------------------------------------------------------- */

function LoadingSequence({ animationClass }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const sparkles = useMemo(
    () => [
      { top: '10%', left: '15%', delay: '0s' },
      { top: '20%', left: '80%', delay: '0.4s' },
      { top: '70%', left: '10%', delay: '0.8s' },
      { top: '75%', left: '85%', delay: '1.2s' },
      { top: '40%', left: '50%', delay: '0.6s' },
    ],
    []
  );

  return (
    <div className={`w-full max-w-xl flex flex-col items-center ${animationClass}`}>
      <div className="glass-panel-strong rounded-3xl px-10 py-14 flex flex-col items-center shadow-2xl w-full">
        <div className="relative w-56 h-56 flex items-center justify-center mb-8">
          {/* Pulsing crystal ball / book glow */}
          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-fuchsia-500/40 to-purple-700/40 blur-xl animate-pulseGlow" />
          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-purple-400/50 to-fuchsia-500/50 blur-md animate-pulseGlow" />

          {/* Sparkles */}
          {sparkles.map((s, i) => (
            <span
              key={i}
              className="absolute text-fuchsia-200 text-lg animate-sparkle"
              style={{ top: s.top, left: s.left, animationDelay: s.delay }}
            >
              ✦
            </span>
          ))}

          {/* Floating wand */}
          <div className="relative z-10 text-6xl animate-floatY drop-shadow-[0_0_18px_rgba(232,121,249,0.8)]">
            🪄
          </div>

          {/* Open book outline beneath */}
          <div className="absolute bottom-2 text-5xl opacity-80 drop-shadow-[0_0_14px_rgba(168,85,247,0.6)]">
            📖
          </div>
        </div>

        <p className="text-purple-100/90 font-medium text-lg mb-2 text-center">
          Crafting your storybook...
        </p>
        <p
          key={messageIndex}
          className="text-fuchsia-300/80 text-sm text-center animate-fadeIn"
        >
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Reader state — split-screen book                                       */
/* ---------------------------------------------------------------------- */

function StoryImage({ src, pageKey }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [pageKey]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-black/30">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-fuchsia-400/30 border-t-fuchsia-400 animate-spin" />
        </div>
      )}
      {src && (
        <img
          key={pageKey}
          src={src}
          alt="Storybook page illustration"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`max-w-full max-h-full object-contain transition-opacity duration-700 ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}

function BookReader({ storybook, currentPage, onNext, onPrev, animationClass }) {
  const page = storybook[currentPage];
  const isFirst = currentPage === 0;
  const isLast = currentPage === storybook.length - 1;

  return (
    <div className={`w-full max-w-6xl ${animationClass}`}>
      <div className="text-center mb-4">
        <span className="text-purple-200/50 text-sm tracking-wide">
          Page {currentPage + 1} of {storybook.length}
        </span>
      </div>

      <div className="glass-panel-strong rounded-3xl shadow-2xl overflow-hidden animate-bookOpen">
        <div className="flex flex-col md:flex-row min-h-[420px] md:h-[520px]">
          {/* Left page — text */}
          <div
            key={`text-${currentPage}`}
            className="flex-1 p-8 md:p-10 flex items-center border-b md:border-b-0 md:border-r border-white/10 relative animate-pageSlideIn scrollbar-thin overflow-y-auto"
          >
            <p className="text-purple-50/95 text-lg md:text-xl leading-relaxed font-serif">
              {page.text}
            </p>
          </div>

          {/* Book spine shadow */}
          <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-fuchsia-300/20 to-transparent" />

          {/* Right page — image canvas */}
          <div
            key={`img-${currentPage}`}
            className="flex-1 p-6 md:p-8 flex items-center justify-center animate-pageSlideIn"
          >
            <StoryImage src={page.imageUrl} pageKey={currentPage} />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="neon-hover px-6 py-2.5 rounded-full glass-panel text-purple-100 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous Page
        </button>
        <button
          onClick={onNext}
          disabled={isLast}
          className="neon-hover px-6 py-2.5 rounded-full glass-panel text-purple-100 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next Page →
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Error panel                                                             */
/* ---------------------------------------------------------------------- */

function ErrorPanel({ message, onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="max-w-md w-full mx-4 rounded-3xl p-8 shadow-2xl text-center"
        style={{
          background: 'rgba(60, 10, 20, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(248, 113, 113, 0.35)',
        }}
      >
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-red-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-red-200/80 text-sm mb-6">{message}</p>
        <button
          onClick={onDismiss}
          className="neon-hover px-8 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 border border-red-300/20"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Floating controls                                                       */
/* ---------------------------------------------------------------------- */

function FloatingControls({ onNewStory, onDownloadPdf, isGeneratingPdf }) {
  return (
    <>
      <button
        onClick={onNewStory}
        title="Create Another Story"
        className="neon-hover fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full glass-circle flex items-center justify-center text-2xl shadow-xl"
      >
        🔄
      </button>
      <button
        onClick={onDownloadPdf}
        disabled={isGeneratingPdf}
        title="Download PDF"
        className={`neon-hover fixed bottom-6 right-6 z-40 h-14 rounded-full glass-circle flex items-center justify-center shadow-xl transition-all duration-300 overflow-hidden ${
          isGeneratingPdf ? 'w-48 px-4 gap-2' : 'w-14'
        }`}
      >
        {isGeneratingPdf ? (
          <>
            <span className="w-4 h-4 shrink-0 rounded-full border-2 border-fuchsia-300/40 border-t-fuchsia-200 animate-spin" />
            <span className="text-xs text-purple-100 font-medium whitespace-nowrap">
              Compiling PDF...
            </span>
          </>
        ) : (
          <span className="text-2xl">⬇️</span>
        )}
      </button>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Offscreen export layout — rendered off-viewport and captured per page  */
/* to build the downloadable PDF, so it never touches the visible UI.     */
/* ---------------------------------------------------------------------- */

const ExportPages = React.forwardRef(({ storybook }, ref) => {
  return (
    <div ref={ref} style={{ position: 'fixed', top: 0, left: '-10000px', pointerEvents: 'none' }}>
      {storybook.map((page, index) => (
        <div
          key={index}
          className="pdf-export-page"
          style={{
            width: `${PDF_PAGE_WIDTH}px`,
            height: `${PDF_PAGE_HEIGHT}px`,
            display: 'flex',
            background: 'linear-gradient(135deg, #150f2e 0%, #1a1033 55%, #2a1245 100%)',
            fontFamily: 'Georgia, serif',
          }}
        >
          <div
            style={{
              flex: 1,
              padding: '56px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <p style={{ fontSize: '26px', lineHeight: 1.6, color: '#f3e8ff', margin: 0 }}>
              {page.text}
            </p>
          </div>
          <div
            style={{
              flex: 1,
              padding: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {page.imageUrl && (
              <img
                src={page.imageUrl}
                alt={`Page ${index + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '16px',
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

/* ---------------------------------------------------------------------- */
/* App                                                                      */
/* ---------------------------------------------------------------------- */

function App() {
  const [userPrompt, setUserPrompt] = useState('');
  const [storybook, setStorybook] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const exportRef = useRef(null);

  // view: 'input' | 'loading' | 'reader'
  const [view, setView] = useState('input');
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimeoutRef = useRef(null);

  const changeView = (nextView, delay = 350) => {
    // A view can change again (e.g. loading -> reader) before the previous
    // transition's timeout fires; without cancelling it, the stale timeout
    // would land later and clobber the newer view back to its own target.
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    setTransitioning(true);
    transitionTimeoutRef.current = setTimeout(() => {
      setView(nextView);
      setTransitioning(false);
      transitionTimeoutRef.current = null;
    }, delay);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    setError(null);
    changeView('loading');

    try {
      const response = await fetch(`${API_BASE_URL}/generate-storybook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userPrompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.storybook) || data.storybook.length === 0) {
        throw new Error(data.error || 'The server returned an empty storybook.');
      }

      setStorybook(data.storybook);
      setCurrentPage(0);
      changeView('reader', 300);
    } catch (err) {
      console.error('Failed to generate storybook:', err);
      setError('Failed to generate storybook. Please check your backend and try again.');
      changeView('input', 300);
    }
  };

  const handleNewStory = () => {
    setStorybook([]);
    setUserPrompt('');
    setCurrentPage(0);
    changeView('input');
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf || storybook.length === 0 || !exportRef.current) return;

    setIsGeneratingPdf(true);
    try {
      const pageNodes = exportRef.current.querySelectorAll('.pdf-export-page');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT],
        compress: true,
      });

      for (let i = 0; i < pageNodes.length; i++) {
        const canvas = await html2canvas(pageNodes[i], {
          scale: 2,
          backgroundColor: '#150f2e',
          useCORS: true,
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.92);

        if (i > 0) {
          pdf.addPage([PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT], 'landscape');
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT);
      }

      pdf.save('my-storybook.pdf');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setError('Failed to generate the PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(p + 1, storybook.length - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(p - 1, 0));
  };

  const animationClass = transitioning ? 'animate-fadeOut' : 'animate-fadeIn';

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center px-4 py-12 font-sans">
      <AmbientBackground />

      {view === 'input' && (
        <InputPanel
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          onSubmit={handleSubmit}
          animationClass={animationClass}
        />
      )}

      {view === 'loading' && <LoadingSequence animationClass={animationClass} />}

      {view === 'reader' && storybook.length > 0 && (
        <>
          <BookReader
            storybook={storybook}
            currentPage={currentPage}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            animationClass={animationClass}
          />
          <FloatingControls
            onNewStory={handleNewStory}
            onDownloadPdf={handleDownloadPdf}
            isGeneratingPdf={isGeneratingPdf}
          />
          <ExportPages ref={exportRef} storybook={storybook} />
        </>
      )}

      {error && <ErrorPanel message={error} onDismiss={() => setError(null)} />}
    </div>
  );
}

export default App;
