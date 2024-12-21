'use client';
import { useState, useRef } from 'react';

function FloatingEmoji({ emoji, delay }) {
  return (
    <div 
      className="absolute animate-float-random"
      style={{ 
        animationDelay: `${delay}s`,
        fontSize: '2rem',
        opacity: 0.7
      }}
    >
      {emoji}
    </div>
  );
}

export default function AnimatedHero({ onCreateClick }) {
  return (
    <div className="min-h-[80vh] relative overflow-hidden bg-gradient-to-br from-fuchsia-100 via-purple-100 to-cyan-100">
      {/* Background animations */}
      <div className="absolute inset-0">
        <div className="absolute top-[10%] left-[10%]">
          <FloatingEmoji emoji="🎈" delay={0} />
        </div>
        <div className="absolute top-[20%] right-[20%]">
          <FloatingEmoji emoji="🎁" delay={1} />
        </div>
        <div className="absolute bottom-[30%] left-[30%]">
          <FloatingEmoji emoji="🎂" delay={2} />
        </div>
        <div className="absolute top-[40%] right-[40%]">
          <FloatingEmoji emoji="✨" delay={3} />
        </div>
        <div className="absolute bottom-[20%] right-[25%]">
          <FloatingEmoji emoji="🎉" delay={4} />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center space-y-8 p-6 animate-fade-in">
        <h1 className="text-7xl font-bold animate-gradient-text">
  <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
    Make Birthdays
  </span>
  <br />
  <span className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-transparent bg-clip-text animate-pulse-slow">
    Magical
  </span>
  <span className="text-6xl"> ✨</span>
</h1>
          
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto animate-slide-up">
            Create stunning birthday messages that will light up someone's special day
          </p>
          
          <div className="flex justify-center gap-6 animate-bounce-sequence">
            <span className="text-5xl transform hover:scale-125 transition-transform cursor-pointer">🎈</span>
            <span className="text-5xl transform hover:scale-125 transition-transform cursor-pointer animate-delay-200">🎁</span>
            <span className="text-5xl transform hover:scale-125 transition-transform cursor-pointer animate-delay-400">🎂</span>
          </div>
          
          <button 
            onClick={onCreateClick}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-12 py-4 rounded-full text-2xl font-semibold hover:opacity-90 transition-all hover:scale-105 animate-pulse-slow shadow-lg"
          >
            Create My Card 🎨
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
