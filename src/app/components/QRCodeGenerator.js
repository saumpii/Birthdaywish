'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X } from 'lucide-react';

const QRCodeGenerator = ({ name }) => {
 const [showQRCode, setShowQRCode] = useState(false);
 const canvasRef = useRef();
 const containerRef = useRef(); // Add this for capturing entire container

 const handleGenerateQRCode = () => {
   setShowQRCode(true);
 };

 const handleClose = () => {
   setShowQRCode(false);
 };

 const handleDownload = () => {
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');
   
   // Set canvas size to include space for text
   canvas.width = 200;
   canvas.height = 250;
   
   // Draw white background
   ctx.fillStyle = '#ffffff';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
   
   // Draw QR code
   ctx.drawImage(canvasRef.current, 0, 0);
   
   // Add text below QR code
   ctx.font = 'bold 16px sans-serif';
   ctx.fillStyle = '#9333ea';
   ctx.textAlign = 'center';
   ctx.fillText(`Happy Birthday ${name}!`, canvas.width/2, 235);
   
   // Create download link
   const link = document.createElement('a');
   link.download = `birthday-qr-${name}.png`;
   link.href = canvas.toDataURL();
   link.click();
 };

 useEffect(() => {
   if (showQRCode) {
     const currentURL = `${process.env.NEXT_PUBLIC_BASE_URL}${window.location.pathname}`;
     const bookmarkedURL = `${currentURL}#wishyouhbd`;

     QRCode.toCanvas(canvasRef.current, bookmarkedURL, {
       width: 200,
       margin: 2,
       color: {
        dark: '#333333',
        light: '#ffffff',
       },
     });
   }
 }, [showQRCode, name]);

 return (
   <div className="flex flex-col items-center gap-4">
     {!showQRCode ? (
       <button
         onClick={handleGenerateQRCode}
         className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-normal"
       >
         Show QR Code
       </button>
     ) : (
       <div ref={containerRef} className="bg-white p-4 rounded-lg shadow-lg relative">
         <button 
           onClick={handleClose}
           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
         >
           <X size={16} />
         </button>
         <canvas ref={canvasRef} className="mb-4" />
         <p className="text-black-600 font-bold text-center mb-4">
           Happy Birthday {name} 🎉
         </p>
         <button
           onClick={handleDownload}
           className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full"
         >
           Download QR Code
         </button>
       </div>
     )}
   </div>
 );
};

export default QRCodeGenerator;