'use client';

import { useEffect, useRef, useState } from 'react';

export default function RobotScene() {
  const [frozen, setFrozen] = useState(false);
  const viewerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.12.94/build/spline-viewer.js';
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const onStart = () => {
      // Step 1: dispatch fake mousemove to center on every possible target
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      const makeEvent = () => new MouseEvent('mousemove', {
        bubbles: true, cancelable: true,
        clientX: cx, clientY: cy,
        screenX: cx, screenY: cy,
      });

      // Fire on document, viewer element, and shadow DOM canvas
      document.dispatchEvent(makeEvent());

      const viewer = viewerRef.current;
      if (viewer) {
        viewer.dispatchEvent(makeEvent());
        // Try shadow root canvas
        try {
          const canvas = viewer.shadowRoot?.querySelector('canvas');
          if (canvas) canvas.dispatchEvent(makeEvent());
        } catch (_) {}
      }

      // Step 2: keep firing center events for 300ms so Spline
      // has no choice but to interpolate toward center
      let count = 0;
      const interval = setInterval(() => {
        document.dispatchEvent(makeEvent());
        const canvas = viewerRef.current?.shadowRoot?.querySelector('canvas');
        if (canvas) canvas.dispatchEvent(makeEvent());
        count++;
        if (count >= 10) clearInterval(interval); // 10 × 30ms = 300ms
      }, 30);

      // Step 3: freeze after giving Spline time to move toward center
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
    }}>
      <spline-viewer
        ref={viewerRef}
        url="https://prod.spline.design/RoAkoZKC6TDrRDPP/scene.splinecode"
        style={{ width: '100%', height: '100%', display: 'block' }}
      />

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