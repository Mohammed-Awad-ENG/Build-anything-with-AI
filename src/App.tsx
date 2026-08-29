import { useState, useEffect } from 'react';
import { ArrowUp, Sparkles, Loader2 } from 'lucide-react';
import Globe from './components/Globe';
import GlitterWrap from './components/GlitterWrap';
import './App.css';

function PromptUI() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setResponse(null);

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

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
