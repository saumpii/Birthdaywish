'use client';
import { useRef,useEffect } from 'react';
import { Mixpanel } from '../utils/mixpanel';
import AnimatedHero from './components/AnimatedHero';
import CardGenerator from './components/CardGenerator';

export default function Home() {
  const formRef = useRef(null);

  useEffect(() => {
    // Track page view when component mounts
   // const userEmail = getUserEmail(); // You'll need to implement this based on your auth system
    Mixpanel.track('Page View', {
     // email: userEmail || null,
      page: 'home'
    });
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <main className="h-screen overflow-y-auto touch-auto -webkit-overflow-scrolling-touch pb-24">
    <AnimatedHero onCreateClick={scrollToForm} />
    <div ref={formRef} className="scroll-mt-16 scroll-smooth mb-20">
      <CardGenerator />
    </div>
  </main>
  );
}