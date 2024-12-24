'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X } from 'lucide-react'; // Import X icon

const QRCodeGenerator = ({ name }) => {
 const [showQRCode, setShowQRCode] = useState(false);
 const canvasRef = useRef();

 const handleGenerateQRCode = () => {
   setShowQRCode(true);
 };

 const handleClose = () => {
   setShowQRCode(false);
 };

 const handleDownload = () => {
   const link = document.createElement('a');
   link.download = `birthday-qr-${name}.png`;
   link.href = canvasRef.current.toDataURL();
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
         dark: '#9333ea',
         light: '#ffffff',
       },
     }, (error) => {
       if (error) console.error(error);
       else {
         const ctx = canvasRef.current.getContext('2d');
         ctx.fillStyle = '#ffffff';
         ctx.fillRect(0, 200, 200, 40);
         
         ctx.font = 'bold 14px sans-serif';
         ctx.fillStyle = '#9333ea';
         ctx.textAlign = 'center';
         ctx.fillText(`Happy Birthday ${name}!`, 100, 225);
       }
     });
   }
 }, [showQRCode, name]);

 return (
   <div className="flex flex-col items-center gap-4">
     {!showQRCode ? (
       <button
         onClick={handleGenerateQRCode}
         className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
       >
         Show QR Code
       </button>
     ) : (
       <div className="bg-white p-4 rounded-lg shadow-lg relative">
         <button 
           onClick={handleClose}
           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
         >
           <X size={16} />
         </button>
         <canvas ref={canvasRef} className="mb-4" />
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