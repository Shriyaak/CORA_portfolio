'use client';

import { useEffect, useRef } from 'react';

export default function WelcomeVoice() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem('cora_welcome_played')) return;
    if (window.__welcomePlayed) return;
    if (document.hidden) return;

    window.__welcomePlayed = true;
    sessionStorage.setItem('cora_welcome_played', 'true');

    const audio = new Audio('/welcome.mp3');
    audioRef.current = audio;
    audio.volume = 0.8;

    audio.addEventListener('play', () => window.dispatchEvent(new CustomEvent('welcome_audio_start')));
    audio.addEventListener('ended', () => window.dispatchEvent(new CustomEvent('welcome_audio_end')));

    // Pause when user switches tab or window
    const onHide = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        window.dispatchEvent(new CustomEvent('welcome_audio_end'));
      }
    };

    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('blur', onHide);

    audio.play().catch(() => {
      const unlock = () => {
        if (!document.hidden) audio.play();
        window.removeEventListener('click', unlock);
      };
      window.addEventListener('click', unlock);
    });

    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('blur', onHide);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return null;
}