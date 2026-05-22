'use client';

import { useEffect, useRef, useState } from 'react';

export default function RobotScene() {
  const [frozen, setFrozen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const viewerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.12.94/build/spline-viewer.js';
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const onStart = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      const makeEvent = () => new MouseEvent('mousemove', {
        bubbles: true, cancelable: true,
        clientX: cx, clientY: cy,
        screenX: cx, screenY: cy,
      });

      document.dispatchEvent(makeEvent());

      const viewer = viewerRef.current;
      if (viewer) {
        viewer.dispatchEvent(makeEvent());
        try {
          const canvas = viewer.shadowRoot?.querySelector('canvas');
          if (canvas) canvas.dispatchEvent(makeEvent());
        } catch (_) {}
      }

      let count = 0;
      const interval = setInterval(() => {
        document.dispatchEvent(makeEvent());
        const canvas = viewerRef.current?.shadowRoot?.querySelector('canvas');
        if (canvas) canvas.dispatchEvent(makeEvent());
        count++;
        if (count >= 10) clearInterval(interval);
      }, 30);

      setTimeout(() => setFrozen(true), 350);
    };

    const onEnd = () => setFrozen(false);

    window.addEventListener('welcome_audio_start', onStart);
    window.addEventListener('welcome_audio_end', onEnd);

    return () => {
      window.removeEventListener('welcome_audio_start', onStart);
      window.removeEventListener('welcome_audio_end', onEnd);
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
    }}>
      <spline-viewer
        ref={viewerRef}
        url="https://prod.spline.design/RoAkoZKC6TDrRDPP/scene.splinecode"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          // Zoom out on mobile by scaling down and shifting up slightly
          transform: isMobile ? 'scale(0.7) translateY(-10%)' : 'none',
          transformOrigin: 'center top',
          transition: 'transform 0.3s ease',
        }}
      />

      {/* Cover Spline watermark */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '180px',
        height: '36px',
        background: 'rgb(227, 227, 227)',
        zIndex: 30,
        pointerEvents: 'none',
      }} />

      {frozen && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          cursor: 'default',
          background: 'transparent',
        }} />
      )}
    </div>
  );
}