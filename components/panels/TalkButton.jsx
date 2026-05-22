'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const BG = '#e0e0e0';
const SHADOW_OUT = '6px 6px 14px #bebebe, -6px -6px 14px #ffffff';
const SHADOW_INSET = 'inset 4px 4px 10px #bebebe, inset -4px -4px 10px #ffffff';

const GLASS_BG      = 'rgba(20, 20, 22, 0.72)';
const GLASS_BORDER  = '1px solid rgba(255,255,255,0.12)';
const GLASS_SHEEN   = `linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.0) 100%)`;
const GLASS_SHADOW  = '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)';
const GLASS_INSET   = 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)';
const BLUR          = 'blur(18px) saturate(1.4)';
const TEXT_PRIMARY   = 'rgba(255,255,255,0.92)';
const TEXT_SECONDARY = 'rgba(255,255,255,0.45)';
const TEXT_DIM       = 'rgba(255,255,255,0.28)';

const glassCard = (extra = {}) => ({
  background: GLASS_BG,
  backdropFilter: BLUR,
  WebkitBackdropFilter: BLUR,
  border: GLASS_BORDER,
  boxShadow: GLASS_SHADOW,
  borderRadius: '20px',
  position: 'relative',
  overflow: 'hidden',
  ...extra,
});

function Sheen() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: GLASS_SHEEN,
      borderRadius: '20px',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}

const BAR_COUNT = 28;

function FrequencyBars({ state }) {
  const barsRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const animate = (t) => {
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        let height;
        if (state === 'idle') {
          height = 4 + Math.sin(t / 800 + i * 0.7) * 4 + Math.sin(t / 1200 + i * 0.4) * 3;
        } else if (state === 'thinking') {
          height = 8 + Math.sin(t / 150 + i * 0.9) * 18 + Math.sin(t / 90 + i * 1.3) * 12;
        } else if (state === 'responding') {
          height = 6 + Math.sin(t / 300 + i * 0.8) * 12 + Math.sin(t / 500 + i * 0.5) * 8;
        } else if (state === 'listening') {
          height = 6 + Math.sin(t / 100 + i * 1.1) * 20 + Math.sin(t / 60 + i * 0.8) * 14;
        }
        bar.style.height = `${Math.max(3, height)}px`;
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [state]);

  return (
    <div className="freq-bars" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '4px', height: '60px', width: '280px', padding: '10px 20px',
    }}>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <div key={i} ref={el => barsRef.current[i] = el}
          style={{
            width: '3px', height: '4px', borderRadius: '2px',
            background: state === 'listening' ? 'rgba(100,160,255,0.75)' : 'rgba(60,60,60,0.75)',
            transition: 'background 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }) {
  const parts = msg.text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: '85%',
        background: msg.role === 'user' ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.11)',
        border: `1px solid rgba(255,255,255,${msg.role === 'cora' ? '0.14' : '0.06'})`,
        borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        padding: '9px 13px', fontFamily: 'Rajdhani, sans-serif', fontSize: '15px',
        color: msg.role === 'user' ? TEXT_SECONDARY : TEXT_PRIMARY,
        lineHeight: 1.55, boxShadow: msg.role === 'cora' ? GLASS_INSET : 'none',
        wordBreak: 'break-word', overflowWrap: 'break-word',
      }}>
        {parts.map((part, j) =>
          /^https?:\/\//.test(part) ? (
            <a key={j} href={part} target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(100,180,255,0.9)', textDecoration: 'underline', cursor: 'pointer', wordBreak: 'break-all' }}
            >{part}</a>
          ) : part
        )}
      </div>
    </div>
  );
}

const INITIAL_MESSAGES = [
  { role: 'cora', text: "Hi! I'm CORA. Ask me anything about Shreeya ✨" },
];

export default function TalkButton() {
  const router = useRouter();
  const [open, setOpen]             = useState(false);
  const [activated, setActivated]   = useState(false);
  const [messages, setMessages]     = useState(INITIAL_MESSAGES);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [barState, setBarState]     = useState('idle');
  const [listening, setListening]   = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [isMobile, setIsMobile]     = useState(false);
  const [pillHover, setPillHover]   = useState(false);
  const bottomRef      = useRef(null);
  const inputRef       = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef       = useRef(null);
  const autoStopRef    = useRef(null);

  useEffect(() => {
    if (window.__welcomePlayed) {
      setActivated(true);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setMicSupported(true);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePillClick = () => {
    window.__welcomePlayed = true;
    sessionStorage.setItem('cora_welcome_played', 'true');

    const audio = new Audio('/welcome.mp3');
    audioRef.current = audio;
    audio.volume = 0.8;

    audio.addEventListener('play', () => window.dispatchEvent(new CustomEvent('welcome_audio_start')));
    audio.addEventListener('ended', () => window.dispatchEvent(new CustomEvent('welcome_audio_end')));

    const onHide = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        window.dispatchEvent(new CustomEvent('welcome_audio_end'));
      }
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('blur', onHide);

    audio.play().catch(err => console.error('Audio failed:', err));

    setActivated(true);
    setTimeout(() => inputRef.current?.focus(), 400);
  };

  const sendText = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setInput('');
    setOpen(true);
    setMessages(m => [...m, { role: 'user', text: trimmed }]);
    setLoading(true);
    setBarState('thinking');

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = await res.json();
      setBarState('responding');
      setMessages(m => [...m, { role: 'cora', text: data.reply }]);
      setTimeout(() => setBarState('idle'), 2000);
    } catch {
      setMessages(m => [...m, { role: 'cora', text: 'Something went wrong. Please try again.' }]);
      setBarState('idle');
    } finally {
      setLoading(false);
    }
  };

  const send = () => sendText(input);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      stream.getTracks().forEach(t => t.stop());
    } catch (err) {
      alert('Microphone access was denied. Please allow microphone access in your browser settings and try again.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    autoStopRef.current = setTimeout(() => {
      recognition.stop();
      setListening(false);
      setBarState('idle');
    }, 5000);

    recognition.onstart = () => { setListening(true); setBarState('listening'); setInput(''); };
    recognition.onresult = (event) => {
      clearTimeout(autoStopRef.current);
      const transcript = event.results[0][0].transcript;
      setListening(false); setBarState('idle'); setInput(transcript);
      setTimeout(() => sendText(transcript), 100);
    };
    recognition.onerror = (e) => {
      clearTimeout(autoStopRef.current);
      console.error('Speech recognition error:', e.error);
      setListening(false); setBarState('idle');
    };
    recognition.onend = () => {
      clearTimeout(autoStopRef.current);
      setListening(false);
      if (barState === 'listening') setBarState('idle');
    };
    recognition.start();
  };

  const stopListening = () => {
    clearTimeout(autoStopRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false); setBarState('idle');
  };

  return (
    <>
      <div className="talk-input-wrapper" style={{
        position: 'absolute', top: '23%', left: '53%',
        transform: 'translateX(-50%)', zIndex: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
      }}>

        {/* ── MOBILE NAV PILLS — above search bar, mobile only ── */}
        {isMobile && (
          <div style={{
            display: 'flex', gap: '10px', marginBottom: '8px',
          }}>
            {[
              { label: 'Projects', href: '/projects' },
              { label: "Extra's", href: '/extras' },
            ].map(item => (
              <div
                key={item.label}
                onClick={() => router.push(item.href)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.35)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'rgba(0,0,0,0.8)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}

        {/* ── PILL ── */}
        {!activated && (
          <div
            onClick={handlePillClick}
            onMouseEnter={() => setPillHover(true)}
            onMouseLeave={() => setPillHover(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: BG, boxShadow: pillHover ? SHADOW_INSET : SHADOW_OUT,
              borderRadius: '999px', padding: '16px 32px',
              cursor: 'pointer', userSelect: 'none',
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              transform: pillHover ? 'scale(0.98)' : 'scale(1)',
              animation: 'pillFloat 2.8s ease-in-out infinite',
            }}
          >
            <span style={{
              fontFamily: 'Orbitron, monospace', fontSize: '11px', fontWeight: '700',
              letterSpacing: '0.2em', color: 'rgba(0,0,0,0.75)',
              textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              Ask about Shreeya
            </span>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: BG, boxShadow: SHADOW_INSET,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M1 1L9 6L1 11V1Z" fill="rgba(0,0,0,0.5)" />
              </svg>
            </div>
          </div>
        )}

        {/* ── SEARCH BAR ── */}
        {activated && (
          <div className="talk-input-bar" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: BG, boxShadow: SHADOW_OUT,
            borderRadius: '999px', padding: '14px 24px', width: '420px',
            border: 'none', transition: 'box-shadow 0.2s ease',
            animation: 'expandIn 0.4s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={listening ? 'Listening... tap mic to stop' : 'Ask about Shreeya...'}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '17px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '700',
                color: listening ? 'rgba(100,160,255,0.9)' : 'rgba(0,0,0,0.85)',
                letterSpacing: '0.02em', transition: 'color 0.2s ease', minWidth: 0,
              }}
            />
            <button onClick={send} style={{
              background: BG, boxShadow: SHADOW_INSET, border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px',
              color: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', transition: 'box-shadow 0.15s, color 0.15s', flexShrink: 0,
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = SHADOW_OUT; e.currentTarget.style.color = 'rgba(0,0,0,0.85)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = SHADOW_INSET; e.currentTarget.style.color = 'rgba(0,0,0,0.5)'; }}
            >→</button>

            {micSupported && !isMobile && (
              <button
                onClick={listening ? stopListening : startListening}
                title={listening ? 'Tap to stop' : 'Speak your question'}
                style={{
                  background: listening ? 'rgba(100,160,255,0.15)' : BG,
                  boxShadow: listening ? SHADOW_INSET : SHADOW_OUT,
                  border: 'none', borderRadius: '50%',
                  width: listening ? '40px' : '32px',
                  height: listening ? '40px' : '32px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0, position: 'relative',
                  transition: 'box-shadow 0.15s ease, background 0.2s ease, width 0.2s ease, height 0.2s ease',
                }}
              >
                {listening && (
                  <div style={{
                    position: 'absolute', inset: '-5px', borderRadius: '50%',
                    border: '2px solid rgba(100,160,255,0.5)',
                    animation: 'micPulse 1s ease-in-out infinite', pointerEvents: 'none',
                  }} />
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={listening ? 'rgba(100,160,255,1)' : 'rgba(0,0,0,0.5)'}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: 'stroke 0.2s ease' }}
                >
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M5 10a7 7 0 0 0 14 0"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="8" y1="22" x2="16" y2="22"/>
                </svg>
              </button>
            )}
          </div>
        )}

        <FrequencyBars state={barState} />
      </div>

      {/* ── CHAT PANEL ── */}
      {open && (
        <div className="talk-chat-panel" style={{
          position: 'fixed', top: '80%', right: '32px',
          transform: 'translateY(-70%)', zIndex: 30,
          animation: 'slideIn 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{ ...glassCard({ padding: '20px', width: '320px' }) }}>
            <Sheen />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: loading ? 'rgba(255,200,100,0.9)' : listening ? 'rgba(100,160,255,0.9)' : 'rgba(180,220,180,0.8)',
                    boxShadow: loading ? '0 0 6px rgba(255,200,100,0.6)' : listening ? '0 0 6px rgba(100,160,255,0.6)' : '0 0 6px rgba(150,220,150,0.6)',
                    transition: 'all 0.3s',
                  }} />
                  <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '8px', letterSpacing: '0.3em', color: TEXT_SECONDARY, textTransform: 'uppercase' }}>
                    {loading ? 'CORA is thinking...' : listening ? 'Listening...' : 'Chat with CORA'}
                  </span>
                </div>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_DIM, fontSize: '18px', lineHeight: 1 }}>×</button>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px', padding: '12px', height: '340px', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', scrollbarWidth: 'none',
              }}>
                {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px 14px 14px 4px', padding: '10px 16px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                      {[0,1,2].map(d => (
                        <div key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: 'dotPulse 1.2s ease-in-out infinite', animationDelay: `${d * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask CORA..."
                  style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '11px 14px', fontSize: '15px', fontFamily: 'Rajdhani, sans-serif', outline: 'none', color: TEXT_PRIMARY }}
                />
                <button onClick={send} style={{ width: '42px', height: '42px', flexShrink: 0, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', color: TEXT_PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: GLASS_INSET }}>→</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-50%) translateX(20px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes micPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50%       { transform: scale(1.35); opacity: 1; }
        }
        @keyframes pillFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes expandIn {
          from { opacity: 0; transform: scaleX(0.6); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @media (max-width: 768px) {
          .talk-input-wrapper {
            top: 10% !important; left: 50% !important;
            transform: translateX(-50%) !important; width: 92vw !important;
          }
          .talk-input-bar { width: 100% !important; padding: 12px 16px !important; }
          .freq-bars { width: 200px !important; }
          .talk-chat-panel {
            top: auto !important; bottom: 12px !important;
            right: 12px !important; left: 12px !important;
            transform: none !important;
            animation: slideInMobile 0.35s cubic-bezier(0.22,1,0.36,1) !important;
          }
          .talk-chat-panel > div { width: 100% !important; }
        }
        @keyframes slideInMobile {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}