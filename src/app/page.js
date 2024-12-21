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
    <main className="bg-white">
      <AnimatedHero onCreateClick={scrollToForm} />
      <div ref={formRef} className="scroll-mt-6">
        <CardGenerator />
      </div>
    </main>
  );
}