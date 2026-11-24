import { Outlet } from 'react-router-dom';
import NetworkBackground from './NetworkBackground';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <NetworkBackground />
      <div className="cyber-grid" />
      <Navbar />
      <main className="app-container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}