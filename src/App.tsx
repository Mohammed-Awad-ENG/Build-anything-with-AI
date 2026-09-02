import { useState, useEffect } from 'react';
import { ArrowUp, Sparkles, Loader2 } from 'lucide-react';
import Globe from './components/Globe';
import GlitterWrap from './components/GlitterWrap';
import TextType from './components/TextType';
import './App.css';

function PromptUI() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (response) {
      const timer = setTimeout(() => {
        setResponse(null);
        setShowToast(true);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [response]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setResponse(null);
    setShowToast(false);

    try {

      await new Promise(resolve => setTimeout(resolve, 800));

      const res = await fetch('https://naas.isalman.dev/no');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      setResponse(data.reason || "No.");
    } catch (err) {
      console.error(err);
      setResponse("No. (And the API failed too)");
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };
  return (
    <main className="main-content">
      <header className="header">
        <Sparkles className="sparkles-icon" />
        <h1>Build anything with AI</h1>
        <p>Turn your wildest ideas into reality in seconds.</p>
      </header>

      {response && (
        <div className="response-container fade-in">
          <h2 className="response-title">NO.</h2>
          <p className="response-reason">{response}</p>
        </div>
      )}

      {showToast && (
        <div className="toast-container">
          <p>Try again</p>
        </div>
      )}

      <div className="input-wrapper">
        <form onSubmit={handleSubmit} className="prompt-form">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What do you want to build?"
            className="prompt-input"
            disabled={isGenerating}
            autoFocus
          />
          <button 
            type="submit" 
            className={`submit-button ${prompt.trim() && !isGenerating ? 'active' : ''}`}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? <Loader2 className="spinner" size={20} /> : <ArrowUp size={20} />}
          </button>
        </form>
        <div className="input-glow"></div>
      </div>
    </main>
  );
}

const LOADING_MESSAGES = [
  "Allocating unlimited GPU compute...",
  "Bypassing usage limits...",
  "Connecting to global superclusters...",
  "Unlocking infinite AI power...",
  "Initializing limitless context window...",
  "Synchronizing quantum neural networks...",
  "Preparing unmetered generation engine..."
];

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText] = useState(() => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate loading time based on typing animation duration
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(loadingTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextType 
          text={loadingText} 
          typingSpeed={50} 
          loop={false} 
          textColors={['#ffffff']}
          className="loading-text"
          style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', textAlign: 'center' }}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="stars-container">
        <GlitterWrap particleCount={isMobile ? 150 : 500} />
      </div>

      <div className="globe-container">
        <Globe 
          scale={isMobile ? 5 : 8} 
          detail={isMobile ? 1 : 5}
          showGrid={!isMobile}
          showOutline={!isMobile}
          fill={isMobile ? "solid" : "dots"}
          fillColor="#ffffff"
          dots={{ color: "#ffffff", size: 5, density: isMobile ? 3 : 8, allDots: false }}
        />
      </div>

      <PromptUI />
    </div>
  );
}

export default App;
