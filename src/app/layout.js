// src/app/layout.js
// src/app/layout.js
import { Inter } from 'next/font/google';
import { AuthProvider } from "./components/Authprovider";
import Navbar from "./components/Navbar";  // Make sure to import Navbar
import { AuthHandler } from './components/AuthHandler';
import './globals.css';


const inter = Inter({ subsets: ['latin'] });


export const metadata = {
  title: 'Birthday Website',
  description: 'Create beautiful birthday wishes and celebration rooms',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuthHandler/>
          <Navbar />  {/* Add Navbar here */}
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}