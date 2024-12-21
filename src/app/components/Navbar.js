// src/components/Navbar.js
'use client';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Birthday Website
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <Link href="/create-room" className="hover:text-blue-500">Create Room</Link>
          <Link href="/make-my-weekend" className="hover:text-blue-500">Make My Weekend</Link>
          {session ? (
            <div className="inline-flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session.user.email}
              </span>
              <button 
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}