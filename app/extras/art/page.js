'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const IS_OWNER = process.env.NEXT_PUBLIC_IS_OWNER === 'true';

const BG = 'rgb(227, 227, 227)';
const BOX = 'rgb(200, 200, 200)';
const TITLE = 'rgb(30, 30, 30)';
const TEXT = 'rgb(103, 103, 103)';
const SHADOW = '8px 8px 18px #b0b0b0, -8px -8px 18px #ffffff';
const SHADOW_SM = '5px 5px 10px #b0b0b0, -5px -5px 10px #ffffff';
const INSET = 'inset 4px 4px 8px #b0b0b0, inset -4px -4px 8px #ffffff';

const SUPABASE = 'https://oeotkjwrryabdoihquvb.supabase.co/storage/v1/object/public/cora-images';

const initialArt = [
  { id: 1, src: `${SUPABASE}/art1.webp`, aspect: '3/4' },
  { id: 2, src: `${SUPABASE}/art2.webp`, aspect: '4/3' },
  { id: 3, src: `${SUPABASE}/art3.webp`, aspect: '1/1' },
  { id: 4, src: `${SUPABASE}/art4.webp`, aspect: '4/3' },
  { id: 5, src: `${SUPABASE}/art5.webp`, aspect: '3/4' },
  { id: 6, src: `${SUPABASE}/art6.webp`, aspect: '1/1' },
];

function Lightbox({ src, items, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease', cursor: 'zoom-out',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <button onClick={onClose} style={{
        position: 'absolute', top: '24px', right: '24px',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50%', width: '40px', height: '40px',
        color: 'white', fontSize: '20px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)', transition: 'background 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >×</button>

      <button onClick={e => { e.stopPropagation(); onPrev(); }} style={{
        position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50%', width: '44px', height: '44px',
        color: 'white', fontSize: '18px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)', transition: 'background 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >←</button>

      <button onClick={e => { e.stopPropagation(); onNext(); }} style={{
        position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50%', width: '44px', height: '44px',
        color: 'white', fontSize: '18px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)', transition: 'background 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >→</button>

      <img src={src} onClick={e => e.stopPropagation()} style={{
        maxWidth: '88vw', maxHeight: '88vh',
        objectFit: 'contain', borderRadius: '16px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        animation: 'scaleIn 0.25s cubic-bezier(0.22,1,0.36,1)',
        cursor: 'default',
      }} />
    </div>
  );
}

export default function ArtPage() {
  const router = useRouter();
  const [backHover, setBackHover] = useState(false);
  const [items, setItems] = useState(initialArt);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => (i - 1 + items.length) % items.length);
  const nextImage = () => setLightboxIndex(i => (i + 1) % items.length);

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      setItems(prev => [...prev, { id: Date.now() + Math.random(), src: url, aspect: '4/3', local: true }]);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div style={{
      width: '100vw', minHeight: '100vh', background: BG,
      padding: '40px', boxSizing: 'border-box',
      overflowY: 'auto', overflowX: 'hidden',
    }}>

      {lightboxIndex !== null && (
        <Lightbox
          src={items[lightboxIndex].src}
          items={items}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
        <button
          onClick={() => router.push('/extras')}
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
        >← Back</button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '22px', fontWeight: '900', color: TITLE, letterSpacing: '0.3em' }}>
            / ART
          </div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', color: TEXT, letterSpacing: '0.15em', marginTop: '4px' }}>
            Pen & ink · Architecture · Cities
          </div>
        </div>

        <div style={{ width: '100px' }} />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ columns: '3 280px', gap: '16px', marginBottom: '48px' }}>
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              style={{
                breakInside: 'avoid', marginBottom: '16px',
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: SHADOW_SM,
                borderTop: '1.5px solid rgba(255,255,255,0.9)',
                borderLeft: '1.5px solid rgba(255,255,255,0.8)',
                cursor: 'zoom-in',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = SHADOW; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = SHADOW_SM; }}
            >
              <img src={item.src} alt="" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
              {item.local && (
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  background: 'rgba(103,103,103,0.7)', borderRadius: '6px',
                  padding: '3px 8px', fontFamily: 'Orbitron, monospace',
                  fontSize: '7px', color: 'white', letterSpacing: '0.1em',
                }}>LOCAL</div>
              )}
            </div>
          ))}
        </div>

        {/* ← WRAPPED IN IS_OWNER */}
        {IS_OWNER && (
          <div style={{ borderTop: '1px solid rgba(103,103,103,0.15)', paddingTop: '40px', marginBottom: '60px' }}>
            <div style={{
              fontFamily: 'Orbitron, monospace', fontSize: '11px',
              color: TEXT, letterSpacing: '0.2em',
              textTransform: 'uppercase', marginBottom: '16px', opacity: 0.6,
            }}>
              + Add more
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => document.getElementById('art-file-input').click()}
              style={{
                background: dragOver ? 'rgba(103,103,103,0.08)' : BOX,
                boxShadow: dragOver ? INSET : SHADOW_SM,
                border: dragOver ? '2px dashed rgba(103,103,103,0.4)' : '2px dashed rgba(103,103,103,0.2)',
                borderRadius: '20px', padding: '48px 24px',
                textAlign: 'center', transition: 'all 0.2s ease', cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.4 }}>🖼</div>
              <div style={{
                fontFamily: 'Orbitron, monospace', fontSize: '10px',
                color: TEXT, letterSpacing: '0.2em',
                textTransform: 'uppercase', marginBottom: '8px',
              }}>
                Drop images here or click to browse
              </div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', color: TEXT, opacity: 0.5 }}>
                PNG, JPG, WEBP — previews locally until you upload to Supabase
              </div>
              <input id="art-file-input" type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={e => handleFiles(e.target.files)} />
            </div>

            <div style={{
              marginTop: '16px', fontFamily: 'Rajdhani, sans-serif', fontSize: '12px',
              color: TEXT, opacity: 0.45, textAlign: 'center', lineHeight: '1.6',
            }}>
              To persist images: upload to Supabase bucket <code style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.06)', padding: '1px 6px', borderRadius: '4px' }}>cora-images</code> and add the URL to <code style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.06)', padding: '1px 6px', borderRadius: '4px' }}>initialArt</code> in this file.
            </div>
          </div>
        )}
        {/* ← END IS_OWNER */}

      </div>
    </div>
  );
}