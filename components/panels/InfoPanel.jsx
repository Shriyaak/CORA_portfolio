'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BG = '#e0e0e0';
const SHADOW_OUT = '6px 6px 14px #bebebe, -6px -6px 14px #ffffff';
const SHADOW_INSET = 'inset 4px 4px 10px #bebebe, inset -4px -4px 10px #ffffff';

const SECTION = {
  background: BG,
  boxShadow: SHADOW_INSET,
  borderRadius: '20px',
  padding: '22px 24px',
  border: 'none',
};

const LABEL = {
  fontFamily: 'Orbitron, monospace',
  fontSize: '10px',
  letterSpacing: '0.3em',
  color: 'rgba(0,0,0,0.4)',
  textTransform: 'uppercase',
  marginBottom: '14px',
};

const skills = ['Python', 'React', 'Azure', 'LLMs', 'RAG', 'Next.js', 'GenAI'];

const navCards = [
  { label: 'Projects', icon: '⬡', href: '/projects' },
  { label: "Extra's",  icon: '◇', href: '/extras'   },
];

export default function InfoPanel() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: isMobile ? 'auto' : '28px',
      bottom: isMobile ? '90px' : 'auto',
      left: isMobile ? '50%' : '28px',
      transform: isMobile
        ? `translateX(-50%) ${visible ? 'translateY(0)' : 'translateY(20px)'}`
        : `translateX(0) ${visible ? 'translateX(0)' : 'translateX(-30px)'}`,
      zIndex: 10,
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      gap: '14px',
      width: isMobile ? 'auto' : '320px',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1), opacity 0.55s ease',
    }}>

      {/* ── ABOUT ME — hidden on mobile ── */}
      {!isMobile && (
        <div style={SECTION}>
          <div style={LABEL}>About Me</div>
          <div style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '24px',
            fontWeight: '700',
            color: 'rgba(0,0,0,0.88)',
            lineHeight: 1.3,
            marginBottom: '8px',
          }}>
            Shreeya
          </div>
          <div style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '17px',
            color: 'rgba(0,0,0,0.6)',
            lineHeight: 1.7,
          }}>
            AI & Data Engineer building intelligent systems that actually matter.
            Passionate about LLMs, RAG pipelines, and turning data into decisions.
          </div>
        </div>
      )}

      {/* ── SKILLS — hidden on mobile ── */}
      {!isMobile && (
        <div style={SECTION}>
          <div style={LABEL}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.map((s, i) => (
              <div key={s} style={{
                background: BG,
                boxShadow: SHADOW_INSET,
                borderRadius: '999px',
                padding: '9px 20px',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '15px',
                fontWeight: '700',
                color: 'rgba(0,0,0,0.75)',
                letterSpacing: '0.06em',
                border: 'none',
                opacity: visible ? 1 : 0,
                transition: `opacity 0.4s ease ${0.2 + i * 0.06}s`,
              }}>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NAV CARDS — always visible ── */}
      {navCards.map((c, i) => (
        <div
          key={c.label}
          style={{
            background: BG,
            boxShadow: SHADOW_OUT,
            borderRadius: '16px',
            padding: isMobile ? '12px 20px' : '14px 18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '8px' : '0',
            userSelect: 'none',
            border: 'none',
            minWidth: isMobile ? '130px' : 'auto',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-16px)',
            transition: `box-shadow 0.2s ease, opacity 0.4s ease ${0.35 + i * 0.07}s, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${0.35 + i * 0.07}s`,
          }}
          onClick={() => router.push(c.href)}
          onMouseEnter={e => e.currentTarget.style.boxShadow = SHADOW_INSET}
          onMouseLeave={e => e.currentTarget.style.boxShadow = SHADOW_OUT}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '7px',
              color: 'rgba(0,0,0,0.4)',
              lineHeight: 1,
            }}>{c.icon}</span>
            <div>
              <div style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '18px',
                fontWeight: '700',
                color: 'rgba(0,0,0,0.85)',
                lineHeight: 1.2,
              }}>{c.label}</div>
            </div>
          </div>
          <span style={{ color: 'rgba(0,0,0,0.4)', fontSize: '15px', fontFamily: 'Rajdhani, sans-serif' }}>→</span>
        </div>
      ))}

    </div>
  );
}