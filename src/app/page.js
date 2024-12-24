'use client';
import { useRef } from 'react';
import AnimatedHero from './components/AnimatedHero';
import CardGenerator from './components/CardGenerator';

export default function Home() {
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <main className="min-h-screen overflow-y-auto touch-auto -webkit-overflow-scrolling-touch pb-24">
    <AnimatedHero onCreateClick={scrollToForm} />
    <div ref={formRef} className="scroll-mt-16 scroll-smooth mb-20">
      <CardGenerator />
    </div>
   </main>
  );
}