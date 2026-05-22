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

        {/* Spline watermark cover — small and tucked in corner */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '160px',
          height: '36px',
          background: '#e0e0e0',
          zIndex: 20,
          pointerEvents: 'none',
        }} />

        <WelcomeVoice />

        {/* Desktop only panels */}
        <div className="desktop-only">
          <ExperiencePanel />
        </div>

        {/* InfoPanel shows on ALL screens — has its own mobile layout */}
        <InfoPanel />

        <div className="desktop-only">
          <BottomBar />
        </div>

        <TalkButton />
      </main>
    </>
  );
}