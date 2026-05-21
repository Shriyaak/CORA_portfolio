'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
const IS_OWNER = process.env.NEXT_PUBLIC_IS_OWNER === 'true';

const BG = 'rgb(227, 227, 227)';
const BOX = 'rgb(200, 200, 200)';
const TITLE = 'rgb(30, 30, 30)';
const TEXT = 'rgb(0, 0, 0)';
const SHADOW = '8px 8px 18px #b0b0b0, -8px -8px 18px #ffffff';
const SHADOW_SM = '5px 5px 10px #b0b0b0, -5px -5px 10px #ffffff';
const INSET = 'inset 4px 4px 8px #b0b0b0, inset -4px -4px 8px #ffffff';

const SUPABASE = 'https://oeotkjwrryabdoihquvb.supabase.co/storage/v1/object/public/cora-images';

const artPlaceholders = [
  { id: 1, src: `${SUPABASE}/art1.webp`, aspect: '3/4' },
  { id: 2, src: `${SUPABASE}/art2.webp`, aspect: '4/3' },
  { id: 3, src: `${SUPABASE}/art3.webp`, aspect: '1/1' },
  { id: 4, src: `${SUPABASE}/art4.webp`, aspect: '4/3' },
  { id: 5, src: `${SUPABASE}/art5.webp`, aspect: '3/4' },
  { id: 6, src: `${SUPABASE}/art6.webp`, aspect: '1/1' },
];

const photoPlaceholders = [
  { id: 1, src: `${SUPABASE}/img1.webp`, aspect: '16/9' },
  { id: 2, src: `${SUPABASE}/IMG_3727.webp`, aspect: '1/1' },
  { id: 3, src: `${SUPABASE}/IMG_4150.webp`, aspect: '4/3' },
  { id: 4, src: `${SUPABASE}/IMG_5249.webp`, aspect: '16/9' },
  { id: 5, src: `${SUPABASE}/IMG_8727.webp`, aspect: '1/1' },
  { id: 6, src: `${SUPABASE}/IMG_0467.webp`, aspect: '4/3' },
];

const articles = [
  {
    id: 1,
    title: 'Understanding Machine Learning',
    subtitle: 'A practical guide to retrieval-augmented generation in production environments.',
    date: 'Apr 2025',
    readTime: '8 min',
    url: 'https://medium.com/@shriyakumbhoje73/understanding-machine-learning-18ed6c732f20',
    thumbnail: `${SUPABASE}/medium1.webp`,
  },
];

// ── LIGHTBOX ──────────────────────────────────────────────────
function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
        cursor: 'zoom-out',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>

      {/* close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '24px', right: '24px',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%', width: '40px', height: '40px',
          color: 'white', fontSize: '20px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >×</button>

      {/* image */}
      <img
        src={src}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: '16px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          animation: 'scaleIn 0.25s cubic-bezier(0.22,1,0.36,1)',
          cursor: 'default',
        }}
      />
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div style={{
      position: 'fixed', bottom: '32px', left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '6px', zIndex: 100, opacity: 0.5,
      animation: 'fadeUpDown 2s ease-in-out infinite',
    }}>
      <style>{`
        @keyframes fadeUpDown {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.4; }
          50% { transform: translateX(-50%) translateY(6px); opacity: 0.8; }
        }
      `}</style>
      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '8px', letterSpacing: '0.25em', color: TEXT, textTransform: 'uppercase' }}>scroll</div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
    </div>
  );
}

function Placeholder({ aspect }) {
  return (
    <div style={{
      width: '100%', aspectRatio: aspect,
      background: 'linear-gradient(135deg, #d4d8de, #c8ccd2)',
      boxShadow: INSET, borderRadius: '16px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '9px', color: 'rgba(0, 0, 0, 0.5)', letterSpacing: '0.2em' }}>
        COMING SOON
      </div>
    </div>
  );
}

function ImageGrid({ items, onImageClick }) {
  return (
    <div style={{ columns: '3 280px', gap: '16px' }}>
      {items.map(item => (
        <div
          key={item.id}
          onClick={() => item.src && onImageClick(item.src)}
          style={{
            breakInside: 'avoid', marginBottom: '16px',
            borderRadius: '16px', overflow: 'hidden',
            boxShadow: SHADOW_SM,
            borderTop: '1.5px solid rgba(255,255,255,0.9)',
            borderLeft: '1.5px solid rgba(255,255,255,0.8)',
            cursor: item.src ? 'zoom-in' : 'default',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => { if (item.src) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = SHADOW; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = SHADOW_SM; }}
        >
          {item.src ? (
            <img src={item.src} alt="" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
          ) : (
            <Placeholder aspect={item.aspect} />
          )}
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ title, link, linkLabel }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      marginBottom: '20px', paddingBottom: '12px',
      borderBottom: '1px solid rgba(103,103,103,0.15)',
    }}>
      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '20px', fontWeight: '900', color: TITLE, letterSpacing: '0.15em' }}>
        / {title}
      </div>
      {link && (
        <a href={link}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            fontFamily: 'Rajdhani, sans-serif', fontSize: '14px', fontWeight: '600',
            color: hover ? TITLE : TEXT, textDecoration: 'none',
            letterSpacing: '0.05em', transition: 'color 0.2s ease',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >{linkLabel} →</a>
      )}
    </div>
  );
}

function ArticleCard({ article }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: 'none', display: 'flex', flexDirection: 'column',
        background: BOX, boxShadow: hovered ? INSET : SHADOW,
        borderRadius: '20px', overflow: 'hidden',
        transition: 'box-shadow 0.25s ease',
        borderTop: '1.5px solid rgba(255,255,255,0.9)',
        borderLeft: '1.5px solid rgba(255,255,255,0.8)',
        borderRight: '1.5px solid rgba(140,140,140,0.2)',
        borderBottom: '1.5px solid rgba(140,140,140,0.2)',
      }}
    >
      <div style={{
        width: '100%', aspectRatio: '16/7',
        background: 'linear-gradient(135deg, #d4d8de, #c8ccd2)',
        boxShadow: hovered ? 'none' : INSET,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative', flexShrink: 0,
      }}>
        {article.thumbnail ? (
          <img src={article.thumbnail} alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #d0d4da 0%, #c4c8ce 40%, #ccd0d6 100%)' }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="rgba(103,103,103,0.12)" />
                <text x="12" y="17" textAnchor="middle" fontFamily="serif" fontSize="14" fontWeight="bold" fill="rgba(103,103,103,0.35)">M</text>
              </svg>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '7px', color: 'rgba(0, 0, 0, 0.5)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                thumbnail coming soon
              </div>
            </div>
          </>
        )}
      </div>
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', fontWeight: '700', color: TITLE, letterSpacing: '0.04em', marginBottom: '6px', lineHeight: '1.6' }}>
            {article.title}
          </div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '13px', color: TEXT, lineHeight: '1.6', marginBottom: '12px' }}>
            {article.subtitle}
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '8px', color: TEXT, letterSpacing: '0.15em', opacity: 0.6 }}>{article.date}</span>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: TEXT, opacity: 0.3, display: 'inline-block' }} />
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '8px', color: TEXT, letterSpacing: '0.15em', opacity: 0.6 }}>{article.readTime} read</span>
          </div>
        </div>
        <div style={{
          width: '38px', height: '38px', flexShrink: 0, background: BOX,
          boxShadow: hovered ? SHADOW_SM : INSET, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', color: TEXT, transition: 'box-shadow 0.2s ease',
        }}>→</div>
      </div>
    </a>
  );
}

export default function ExtrasPage() {
  const router = useRouter();
  const [backHover, setBackHover] = useState(false);
  const [exploreHover, setExploreHover] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const writingRef = useRef(null);

  const scrollToWriting = () => writingRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div style={{
      width: '100vw', minHeight: '100vh', background: BG,
      padding: '40px', boxSizing: 'border-box',
      overflowY: 'auto', overflowX: 'hidden',
    }}>
      <ScrollIndicator />

      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '56px' }}>
        <button
          onClick={() => router.push('/')}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          style={{
            background: BOX, boxShadow: backHover ? INSET : SHADOW_SM,
            border: 'none', borderRadius: '14px', padding: '10px 20px',
            fontFamily: 'Orbitron, monospace', fontSize: '9px',
            letterSpacing: '0.2em', color: TEXT, cursor: 'pointer',
            textTransform: 'uppercase', transition: 'box-shadow 0.2s ease',
            borderTop: '1px solid rgba(255,255,255,0.9)',
            borderLeft: '1px solid rgba(255,255,255,0.8)',
          }}
        >Back to CORA</button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '22px', fontWeight: '900', color: TITLE, letterSpacing: '0.3em' }}>EXTRAS</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', color: TEXT, letterSpacing: '0.15em', marginTop: '4px' }}>Beyond the resume</div>
          <button
            onClick={scrollToWriting}
            onMouseEnter={() => setExploreHover(true)}
            onMouseLeave={() => setExploreHover(false)}
            style={{
              marginTop: '14px', background: BOX,
              boxShadow: exploreHover ? INSET : SHADOW_SM,
              border: 'none', borderRadius: '20px', padding: '8px 18px',
              fontFamily: 'Orbitron, monospace', fontSize: '8px',
              letterSpacing: '0.2em', color: TEXT, cursor: 'pointer',
              textTransform: 'uppercase', transition: 'box-shadow 0.2s ease',
              borderTop: '1px solid rgba(255,255,255,0.9)',
              borderLeft: '1px solid rgba(255,255,255,0.8)',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}
          >find out more about me ↓</button>
        </div>

        <div style={{ width: '120px' }} />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div ref={writingRef}>
          <SectionHeader title="writing" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '64px' }}>
            {articles.map(article => <ArticleCard key={article.id} article={article} />)}
          </div>
        </div>

        <SectionHeader title="art" link="/extras/art" linkLabel="Explore collection" />
        <div style={{ marginBottom: '64px' }}>
          <ImageGrid items={artPlaceholders} onImageClick={setLightboxSrc} />
        </div>

        <SectionHeader title="photos" link="/extras/photos" linkLabel="Explore collection" />
        <div style={{ marginBottom: '64px' }}>
          <ImageGrid items={photoPlaceholders} onImageClick={setLightboxSrc} />
        </div>

      </div>
    </div>
  );
}