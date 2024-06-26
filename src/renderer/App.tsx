import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import SplashScreen from '../components/SplashScreen';
import MainPage from '../components/MainPage';

function Main() {
  return (
    <SplashScreen />
  );
}


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}
