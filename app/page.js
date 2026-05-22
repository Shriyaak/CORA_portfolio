import RobotScene from '../components/core/RobotScene';
import ExperiencePanel from '../components/panels/ExperiencePanel';
import InfoPanel from '../components/panels/InfoPanel';
import BottomBar from '../components/panels/BottomBar';
import TalkButton from '../components/panels/TalkButton';
import WelcomeVoice from '../components/core/WelcomeVoice';

export default function Home() {
  return (
    <>
      <style>{`
        .desktop-only {
          display: block;
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
        }
      `}</style>

      <main style={{
        width: '100vw',
        height: '100vh',
        background: '#e0e0e0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <RobotScene />

        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '400px',
          height: '100px',
          background: '#e3e3e3',
          zIndex: 20,
        }} />

        <WelcomeVoice />

        {/* Hide panels on mobile */}
        <div className="desktop-only">
          <ExperiencePanel />
        </div>
        <div className="desktop-only">
          <InfoPanel />
        </div>
        <div className="desktop-only">
          <BottomBar />
        </div>

        {/* TalkButton shows on all screens but needs mobile positioning */}
        <TalkButton />
      </main>
    </>
  );
}