'use client';

import { useState, useEffect } from 'react';

const BG = '#e0e0e0';
const SHADOW_OUT = '6px 6px 14px #bebebe, -6px -6px 14px #ffffff';
const SHADOW_INSET = 'inset 4px 4px 10px #bebebe, inset -4px -4px 10px #ffffff';

const LABEL = {
  fontFamily: 'Orbitron, monospace',
  fontSize: '10px',
  letterSpacing: '0.3em',
  color: 'rgba(0,0,0,0.4)',
  textTransform: 'uppercase',
};

const experiences = [
  {
    role: 'AI Engineer (Contract)',
    company: 'Aspect Maintenance',
    location: 'London, UK',
    period: 'Oct 2025 – Mar 2026',
    stack: ['LLM', 'Python', 'Azure', 'GCP', 'React'],
    bullets: [
      'Reduced manual support queries by ~30% by building a GenAI-powered semantic search system over 100+ operational documents via a RAG pipeline (Groq LLM, FAISS, BGE-base-en-v1.5)',
      'Increased operational efficiency by 35% with a GPT-4.1 powered KPI insight engine integrating live Salesforce and Webfleet data via an ETL pipeline.',
      'Improved marketing targeting accuracy by 25% delivering a customer segmentation dashboard uncovering high-value segments from 13,000+ records.',
      'Reduced onboarding time by 40% across 335+ users with a centralized LMS with JWT auth and role-based access control.',
    ],
  },
  {
    role: 'Cloud Solutions Engineer (Contract)',
    company: 'Vital Edge Technologies',
    location: 'Pune, India',
    period: 'Feb 2023 – May 2023',
    stack: ['Azure', 'Python', 'PowerBI', 'ERP/DMS'],
    bullets: [
      'Prevented an estimated 30% loss in billable reporting hours by cleaning and validating Azure system logs, eliminating data integrity gaps.',
      'Reduced mean time to detect incidents by ~35% across ERP and DMS clients by managing Power BI dashboards monitoring performance metrics.',
    ],
  },
  {
    role: 'Data Analyst',
    company: 'Foliage Outdoors',
    location: 'Pune, India',
    period: 'Aug 2022 – Jan 2023',
    stack: ['PowerBI', 'Excel', 'Python'],
    bullets: [
      'Recovered 25% of lost client contracts within one quarter by building financial projections that drove the decision to prioritise school partnerships.',
      'Improved profitability projection accuracy by 15% by conducting field research across multiple vendors and updating cost models accordingly.',
    ],
  },
];

export default function ExperiencePanel() {
  const [open, setOpen] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <div style={{
      position: 'absolute',
      top: '100px',
      right: '28px',
      width: '330px',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transform: visible ? 'translateX(0)' : 'translateX(40px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1), opacity 0.55s ease',
    }}>

      <div style={{ ...LABEL, marginBottom: 0, paddingLeft: '4px' }}>Experience</div>

      {experiences.map((exp, i) => (
        <div
          key={i}
          style={{
            background: BG,
            boxShadow: SHADOW_INSET,
            borderRadius: '18px',
            overflow: 'hidden',
            border: 'none',
            opacity: visible ? 1 : 0,
            transition: `opacity 0.4s ease ${0.1 + i * 0.1}s`,
          }}
        >
          {/* Header */}
          <div
            onClick={() => toggle(i)}
            style={{
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              userSelect: 'none',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <div style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '17px',
                fontWeight: '700',
                color: 'rgba(0,0,0,0.88)',
                lineHeight: 1.3,
              }}>{exp.role}</div>
              <div style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '15px',
                color: 'rgba(0,0,0,0.55)',
                marginTop: '3px',
              }}>{exp.company} · {exp.location}</div>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '9px',
                color: 'rgba(0,0,0,0.35)',
                letterSpacing: '0.12em',
                marginTop: '4px',
              }}>{exp.period}</div>
            </div>
            <span style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '14px',
              color: 'rgba(0,0,0,0.3)',
              transform: open === i ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              marginLeft: '12px',
              flexShrink: 0,
            }}>→</span>
          </div>

          {/* Expanded */}
          <div style={{
            maxHeight: open === i ? '600px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.45s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <div style={{ padding: '0 20px 18px' }}>

              <div style={{
                height: '1px',
                background: 'rgba(0,0,0,0.08)',
                marginBottom: '14px',
              }} />

              {/* Stack pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {exp.stack.map(s => (
                  <span key={s} style={{
                    background: BG,
                    boxShadow: SHADOW_OUT,
                    borderRadius: '999px',
                    padding: '4px 12px',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'rgba(0,0,0,0.65)',
                    letterSpacing: '0.05em',
                    border: 'none',
                  }}>{s}</span>
                ))}
              </div>

              {/* Bullets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exp.bullets.map((b, j) => (
                  <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{
                      color: 'rgba(0,0,0,0.2)',
                      fontSize: '10px',
                      marginTop: '4px',
                      flexShrink: 0,
                    }}>◆</span>
                    <span style={{
                      fontFamily: 'Rajdhani, sans-serif',
                      fontSize: '16px',
                      color: 'rgba(0,0,0,0.65)',
                      lineHeight: 1.6,
                    }}>{b}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}