import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import FloatingActions from './components/FloatingActions.jsx';
import ResumeSheet from './components/ResumeSheet.jsx';
import PageTransition from './components/PageTransition.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Skills from './pages/Skills.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import Seo from './components/Seo.jsx';
import MaxDecor from './components/MaxDecor.jsx';
import { useMode } from './mode.js';

// Fun mode is a whole separate scrollytelling site; only download it on request.
const Inception = lazy(() => import('./fun/Inception.jsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/skills" element={<PageTransition><Skills /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { mode } = useMode();

  if (mode === 'fun') {
    return (
      <>
        <Seo />
        <Suspense fallback={<div className="inc-loading" aria-live="polite">Going under…</div>}>
          <Inception />
        </Suspense>
        <FloatingActions />
        <ResumeSheet />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Seo />
      <ScrollToTop />
      <NavBar />
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      <Footer />
      <FloatingActions />
      <ResumeSheet />
      <MaxDecor />
    </div>
  );
}
