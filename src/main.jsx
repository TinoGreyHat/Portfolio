import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import About from './components/About';
import Contact from './components/Contact';
import Veille from './components/Veille';
import RoadmapPage from './components/RoadmapPage';
import RoadmapDetailPage from './components/RoadmapDetailPage';
import Admin from './components/admin/Admin.jsx';
import Layout from './components/Layout';
import { I18nProvider } from './contexts/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/*" element={<Admin />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/veille" element={<Veille />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/roadmap/niveau-:level" element={<RoadmapDetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </I18nProvider>
  </StrictMode>
);
