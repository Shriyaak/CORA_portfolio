import RobotScene from '../components/core/RobotScene';
import ExperiencePanel from '../components/panels/ExperiencePanel'
import InfoPanel from '../components/panels/InfoPanel';
import BottomBar from '../components/panels/BottomBar';
import TalkButton from '../components/panels/TalkButton';
import WelcomeVoice from '../components/core/WelcomeVoice';

export default function Home() {
  return (
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
        width: '240px',
        height: '100px',
        background: '#e0e0e0',
        zIndex: 20,
      }} />
      <WelcomeVoice/>
      <ExperiencePanel/>
      <InfoPanel />
      <BottomBar />
      <TalkButton />
    </main>
  );
}