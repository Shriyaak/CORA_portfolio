'use client';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';

const BG    = '#c8c8c8';
const DARK  = '#9c9c9c';
const MID   = '#b8b8b8';
const LIGHT = '#e2e2e2';

const SHADOW = `8px 8px 16px ${DARK}, -8px -8px 16px ${LIGHT}`;
const INSET  = `inset 4px 4px 8px ${MID}, inset -4px -4px 8px ${LIGHT}`;

const links = [
  { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/shreeyakumbhoje/', title: 'LinkedIn' },
  { icon: <FaGithub />, url: 'https://github.com/Shriyaak', title: 'GitHub' },
  { icon: <HiOutlineDocumentText />, url: '#', title: 'Resume' },
  
];

export default function BottomBar() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '50px',
      left: '50px',
      zIndex: 10,
      display: 'flex',
      gap: '12px',
    }}>
      {links.map(link => (
        <a
          key={link.title}
          href={link.url}
          title={link.title}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: '46px', height: '46px',
            borderRadius: '50%',
            background: BG,
            boxShadow: SHADOW,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Orbitron, monospace',
            fontSize: '20px',
            color: '#505050',
            textDecoration: 'none',
            fontWeight: '700',
            borderTop:  '1.5px solid rgba(255,255,255,0.9)',
            borderLeft: '1.5px solid rgba(255,255,255,0.8)',
            transition: 'box-shadow 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = INSET;
            e.currentTarget.style.color = '#2a2a2a';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = SHADOW;
            e.currentTarget.style.color = '#505050';
          }}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}