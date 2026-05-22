'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const BG = 'rgb(227, 227, 227)';
const BOX = 'rgb(200, 200, 200)';
const TITLE = 'rgb(30, 30, 30)';
const TEXT = 'rgb(103, 103, 103)';
const SHADOW = '8px 8px 18px #b0b0b0, -8px -8px 18px #ffffff';
const SHADOW_SM = '5px 5px 10px #b0b0b0, -5px -5px 10px #ffffff';
const INSET = 'inset 4px 4px 8px #b0b0b0, inset -4px -4px 8px #ffffff';

const SUPABASE = 'https://oeotkjwrryabdoihquvb.supabase.co/storage/v1/object/public/cora-images';

const initialPhotos = [
  { id: 1, src: `${SUPABASE}/img1.webp`, aspect: '16/9' },
  { id: 2, src: `${SUPABASE}/IMG_3727.webp`, aspect: '1/1' },
  { id: 3, src: `${SUPABASE}/IMG_4150.webp`, aspect: '4/3' },
  { id: 4, src: `${SUPABASE}/IMG_5249.webp`, aspect: '16/9' },
  { id: 5, src: `${SUPABASE}/IMG_8727.webp`, aspect: '1/1' },
  { id: 6, src: `${SUPABASE}/IMG_0467.webp`, aspect: '4/3' },
];

function Lightbox({ src, onClose, onPrev, onNext }) {
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
        backdropFilter: 'blur(8px)',
      }}>×</button>
      <button onClick={e => { e.stopPropagation(); onPrev(); }} style={{
        position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50%', width: '44px', height: '44px',
        color: 'white', fontSize: '18px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}>←</button>
      <button onClick={e => { e.stopPropagation(); onNext(); }} style={{
        position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '50%', width: '44px', height: '44px',
        color: 'white', fontSize: '18px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}>→</button>
      <img src={src} onClick={e => e.stopPropagation()} style={{
        maxWidth: '88vw', maxHeight: '88vh', objectFit: 'contain',
        borderRadius: '16px', boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        animation: 'scaleIn 0.25s cubic-bezier(0.22,1,0.36,1)', cursor: 'default',
      }} />
    </div>
  );
}

export default function PhotosPage() {
  const router = useRouter();
  const [backHover, setBackHover] = useState(false);
  const [items] = useState(initialPhotos);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => (i - 1 + items.length) % items.length);
  const nextImage = () => setLightboxIndex(i => (i + 1) % items.length);

  return (
    <div className="photos-page" style={{
      width: '100vw', minHeight: '100vh', background: BG,
      padding: '40px', boxSizing: 'border-box',
      overflowY: 'auto', overflowX: 'hidden',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .photos-page { padding: 20px !important; }
          .photos-header { flex-direction: column !important; align-items: center !important; gap: 12px !important; margin-bottom: 24px !important; }
          .photos-header-spacer { display: none !important; }
          .photos-grid { columns: 2 !important; }
        }
      `}</style>

      {lightboxIndex !== null && (
        <Lightbox src={items[lightboxIndex].src}
          onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />
      )}

      <div className="photos-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
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
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '22px', fontWeight: '900', color: TITLE, letterSpacing: '0.3em' }}>/ PHOTOS</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '12px', color: TEXT, letterSpacing: '0.15em', marginTop: '4px' }}>Places · Moments · Light</div>
        </div>

        <div className="photos-header-spacer" style={{ width: '100px' }} />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="photos-grid" style={{ columns: '3 280px', gap: '16px', marginBottom: '60px' }}>
          {items.map((item, index) => (
            <div key={item.id} onClick={() => setLightboxIndex(index)}
              style={{
                breakInside: 'avoid', marginBottom: '16px',
                borderRadius: '16px', overflow: 'hidden', boxShadow: SHADOW_SM,
                borderTop: '1.5px solid rgba(255,255,255,0.9)',
                borderLeft: '1.5px solid rgba(255,255,255,0.8)',
                cursor: 'zoom-in', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = SHADOW; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = SHADOW_SM; }}
            >
              <img src={item.src} alt="" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}