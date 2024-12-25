// src/components/Navbar.js
'use client';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="p-4 bg-white">
      <div className="container mx-auto">
        {/* Desktop and Mobile Layout */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text z-10">
            Birthday Website
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-800"
          >
            {isMenuOpen ? (
              // Close icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Menu icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-purple-500 transition-colors duration-200">
              Home
            </Link>
            <Link href="/create-room" className="text-gray-600 hover:text-purple-500 transition-colors duration-200">
              Create Birthday Room
            </Link>
            

            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden lg:inline">{session.user.email}</span>
                <button 
                  onClick={() => signOut()}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } md:hidden flex-col mt-4 space-y-4 bg-white`}>
          <Link 
            href="/" 
            className="text-gray-600 hover:text-purple-500 transition-colors duration-200 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/create-room" 
            className="text-gray-600 hover:text-purple-500 transition-colors duration-200 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Create Room
          </Link>
          {session ? (
            <div className="flex flex-col space-y-4 pt-4 border-t">
              <span className="text-sm text-gray-600">{session.user.email}</span>
              <button 
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition-all duration-200 text-center mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}