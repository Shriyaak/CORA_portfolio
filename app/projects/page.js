'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BG = 'rgb(227, 227, 227)';
const BOX = 'rgb(200, 200, 200)';
const TITLE = 'rgb(30, 30, 30)';
const TEXT = 'rgb(12, 10, 10)';
const SHADOW = '8px 8px 18px #b0b0b0, -8px -8px 18px #ffffff';
const SHADOW_SM = '5px 5px 10px #b0b0b0, -5px -5px 10px #ffffff';
const INSET = 'inset 4px 4px 8px #b0b0b0, inset -4px -4px 8px #ffffff';

const featured = [
  { id: 1, title: 'Portfolio Concierge-V1', description: 'AI-powered portfolio', image: 'https://oeotkjwrryabdoihquvb.supabase.co/storage/v1/object/public/cora-images/Screenshot%202026-05-21%20at%2012.14.01%20AM.webp', tech: ['Voyage AI', 'RAG', 'Claude-haiku-4-5', 'ElevenLabs', 'Next.js', 'React Javascript'], github: 'https://github.com', color: ['#c9d6df', '#e2ebf0'] },
  { id: 2, title: 'Learning Management System', description: 'Role-based learning platform with Microsoft authentication (F3/E3)', image: 'https://oeotkjwrryabdoihquvb.supabase.co/storage/v1/object/public/cora-images/LMSprj.webp', tech: ['REST API', 'Django', 'Azure Authentication', 'JWT', 'React Javascript'], github: 'https://github.com/Shriyaak/FullStack--LearningManagementSystem', color: ['#d3cce3', '#e9e4f0'] },
];

const allProjects = [
  ...featured,
  { id: 3, title: 'Semi-Supervised Multi-Object Detection', description: 'Semi-supervised autonomous driving object detection system using YOLOv5', image: '', tech: ['Computer Vision', 'Deep Learning', 'Attention Mechanisms', 'YOLOv5', 'PyTorch'], github: 'https://github.com/Shriyaak/ComputerVision--YOLOv5-Semi-Supervised--Multi-ObjectDetection', color: ['#c8d6e5', '#dde9f5'] },
  { id: 4, title: 'Gesture Recognition', description: 'Machine learning system for recognizing hand gestures using smartphone accelerometer data.', image: '', tech: ['Machine Learning', 'Data Science', 'Feature Engineering'], github: 'https://github.com/Shriyaak/MachineLearning--HandGestureRecognitionProject', color: ['#d5d8dc', '#e8eaed'] },
];

const dataAnalysisProjects = [
  { id: 5, title: 'Customer Segmentation Analysis', description: 'Customer analytics dashboard identifying financial behavior patterns and segmenting users based on demographics, job roles, and balance distribution to support targeted marketing strategies.', tech: ['PowerBI', 'EDA', 'Data Visualisation'], github: 'https://github.com/Shriyaak/Data-Analysis-Projects/tree/main/BankCustomerAnalysisDashboard' },
  { id: 6, title: 'Sales Analysis', description: 'Sales analytics project uncovering revenue trends, customer behavior patterns, and high-value transactions to support data-driven business decisions.', tech: ['SQL', 'Preprocessing', 'EDA'], github: 'https://github.com/Shriyaak/Data-Analysis-Projects/tree/main/RetailSalesAnalysis' },
  { id: 7, title: 'Sales Dashboard', description: 'Interactive analytics dashboard exploring customer purchasing behavior', tech: ['Power BI', 'Excel', 'Business Intelligence'], github: 'https://github.com/Shriyaak/Data-Analysis-Projects/tree/main/BikeSalesDashboard' },
];

const virtualInternships = [
  { id: 8, title: 'Sentiment & Booking Prediction System', description: 'NLP and machine learning project analyzing airline reviews and predicting booking completion using sentiment analysis and classification models.', tech: ['ML','Scikit-learn', 'Random Forest', 'SeaBorn', 'NLP'], github: 'https://github.com/Shriyaak/Virtual_Internships/tree/main/BritishAirways' },
  { id: 9, title: 'M&A Investment Banking Simulation (Citi Forage Program)', description: 'Buyside M&A simulation analyzing a potential acquisition of Best Buy, including financial modeling, valuation, and strategic investment analysis.', tech: ['Excel', 'Financial Modelling', 'Business Analysis'], github: 'https://github.com/Shriyaak/Virtual_Internships/tree/main/CitiGroup' },
  { id: 10, title: 'Operational Analytics & Workforce Equity Dashboard', description: 'Data analytics project for Daikibo Industrials analyzing machine downtime and gender pay equality using industrial telemetry and workforce data.', tech: ['Tableau', 'Excel', 'Business Analysis'], github: 'https://github.com/Shriyaak/Virtual_Internships/tree/main/Deloitte' },
];

const totalProjects = allProjects.length + dataAnalysisProjects.length + virtualInternships.length;

function GitHubIcon({ size = 15, color = 'rgb(103,103,103)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  );
}

function FeaturedCarousel() {
  const [active, setActive] = useState(0);
  const [githubHover, setGithubHover] = useState(false);
  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);

  const prev = () => setActive(a => (a - 1 + featured.length) % featured.length);
  const next = () => setActive(a => (a + 1) % featured.length);
  const project = featured[active];

  return (
    <div style={{
      background: BOX, boxShadow: SHADOW, borderRadius: '28px',
      overflow: 'hidden', marginBottom: '40px',
      borderTop: '1.5px solid rgba(255,255,255,0.9)',
      borderLeft: '1.5px solid rgba(255,255,255,0.8)',
      borderRight: '1.5px solid rgba(140,140,140,0.2)',
      borderBottom: '1.5px solid rgba(140,140,140,0.2)',
    }}>
      <div className="carousel-inner" style={{
        width: '100%', height: '550px',
        background: `linear-gradient(135deg, ${project.color[0]}, ${project.color[1]})`,
        boxShadow: INSET, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.4s ease', overflow: 'hidden',
      }}>
        <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '20px 28px',
          background: 'linear-gradient(to top, rgba(200,200,200,0.85), transparent)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px',
        }}>
          <div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '15px', fontWeight: '700', color: TITLE, letterSpacing: '0.08em', marginBottom: '4px' }}>{project.title}</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', color: TEXT, lineHeight: '1.5', maxWidth: '500px' }}>{project.description}</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
              {project.tech.map(t => (
                <span key={t} style={{ background: 'rgba(200,200,200,0.7)', backdropFilter: 'blur(4px)', borderRadius: '999px', padding: '3px 12px', fontSize: '12px', fontFamily: 'Rajdhani, sans-serif', fontWeight: '700', color: TEXT }}>{t}</span>
              ))}
            </div>
          </div>
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            onMouseEnter={() => setGithubHover(true)} onMouseLeave={() => setGithubHover(false)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', flexShrink: 0 }}
          >
            <div style={{ width: '44px', height: '44px', background: BOX, boxShadow: githubHover ? INSET : SHADOW_SM, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.2s ease' }}>
              <GitHubIcon size={18} />
            </div>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '9px', letterSpacing: '0.15em', color: TEXT, textTransform: 'uppercase' }}>GitHub</span>
          </a>
        </div>

        <button onClick={prev} onMouseEnter={() => setPrevHover(true)} onMouseLeave={() => setPrevHover(false)}
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: BOX, boxShadow: prevHover ? INSET : SHADOW_SM, border: 'none', cursor: 'pointer', fontSize: '18px', color: TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.2s ease' }}>‹</button>

        <button onClick={next} onMouseEnter={() => setNextHover(true)} onMouseLeave={() => setNextHover(false)}
          style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: BOX, boxShadow: nextHover ? INSET : SHADOW_SM, border: 'none', cursor: 'pointer', fontSize: '18px', color: TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow 0.2s ease' }}>›</button>

        <div style={{ position: 'absolute', bottom: '10px', right: '28px', display: 'flex', gap: '6px' }}>
          {featured.map((_, i) => (
            <div key={i} onClick={() => setActive(i)} style={{ width: i === active ? '20px' : '6px', height: '6px', borderRadius: '999px', background: i === active ? TEXT : 'rgba(103,103,103,0.3)', cursor: 'pointer', transition: 'all 0.3s ease' }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  const [githubHover, setGithubHover] = useState(false);

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: BOX, boxShadow: hovered ? SHADOW_SM : SHADOW,
        borderRadius: '24px', padding: '26px',
        display: 'flex', flexDirection: 'column', gap: '14px',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        borderTop: '1.5px solid rgba(255,255,255,0.9)',
        borderLeft: '1.5px solid rgba(255,255,255,0.8)',
        borderRight: '1.5px solid rgba(140,140,140,0.2)',
        borderBottom: '1.5px solid rgba(140,140,140,0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <a href={project.github} target="_blank" rel="noopener noreferrer"
          onMouseEnter={() => setGithubHover(true)} onMouseLeave={() => setGithubHover(false)}
          style={{ width: '38px', height: '38px', background: BOX, boxShadow: githubHover ? INSET : SHADOW_SM, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'box-shadow 0.2s ease' }}
        >
          <GitHubIcon />
        </a>
      </div>
      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '14px', fontWeight: '700', color: TITLE, letterSpacing: '0.06em' }}>{project.title}</div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', color: TEXT, lineHeight: '1.7', flex: 1 }}>{project.description}</div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '14px', color: TEXT, opacity: 0.7 }}>{project.tech.join(', ')}</div>
    </div>
  );
}

function SectionLabel({ text, linkLabel, linkHref }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', letterSpacing: '0.3em', color: TEXT, textTransform: 'uppercase', opacity: 0.7 }}>{text}</div>
      {linkHref && (
        <a href={linkHref} target="_blank" rel="noopener noreferrer"
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
          style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '14px', fontWeight: '600', color: hover ? TITLE : TEXT, textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px' }}
        >{linkLabel} →</a>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const [backHover, setBackHover] = useState(false);

  return (
    <div className="projects-page" style={{
      width: '100vw', minHeight: '100vh', background: BG,
      padding: '40px', boxSizing: 'border-box',
      overflowY: 'auto', overflowX: 'hidden',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .projects-page { padding: 20px !important; }
          .projects-header { flex-direction: column !important; align-items: center !important; gap: 12px !important; margin-bottom: 24px !important; }
          .projects-count { display: none !important; }
          .carousel-inner { height: 280px !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="projects-header" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '40px',
      }}>
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
          <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '24px', fontWeight: '900', color: TITLE, letterSpacing: '0.3em' }}>PROJECTS</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '14px', color: TEXT, letterSpacing: '0.15em', marginTop: '4px' }}>Things I have built</div>
        </div>

        <div className="projects-count" style={{ fontFamily: 'Orbitron, monospace', fontSize: '11px', color: TEXT, letterSpacing: '0.15em', opacity: 0.6 }}>
          {totalProjects} projects
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SectionLabel text="Featured" />
        <FeaturedCarousel />

        <SectionLabel text="All Projects" />
        <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', paddingBottom: '48px' }}>
          {allProjects.map(project => <ProjectCard key={project.id} project={project} />)}
        </div>

        <SectionLabel text="Data Analysis" linkLabel="More on Git" linkHref="https://github.com/Shriyaak/Data-Analysis-Projects" />
        <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', paddingBottom: '48px' }}>
          {dataAnalysisProjects.map(project => <ProjectCard key={project.id} project={project} />)}
        </div>

        <SectionLabel text="Virtual Internships" />
        <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', paddingBottom: '60px' }}>
          {virtualInternships.map(project => <ProjectCard key={project.id} project={project} />)}
        </div>
      </div>
    </div>
  );
}