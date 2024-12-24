'use client';
import { useEffect, useRef, useState} from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({name}) => {
    const QRCodeGenerator = ({ name }) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const canvasRef = useRef();

  const handleGenerateQRCode = () => {
    setShowQRCode(true);
  };

  useEffect(() => {
    if (showQRCode) {
      const currentURL = `${process.env.NEXT_PUBLIC_BASE_URL}${window.location.pathname}`;
      const bookmarkedURL = `${currentURL}#wishyouhbd`;
      const qrText = `Happy Birthday ${name}!`;

      QRCode.toCanvas(canvasRef.current, bookmarkedURL, {
        width: 256,
        margin: 1,
        color: {
          dark: '#333333',
          light: '#ffffff',
        },
      }, (error) => {
        if (error) console.error(error);
        else {
          const ctx = canvasRef.current.getContext('2d');
          const fontSize = 18;
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.fillText(qrText, canvasRef.current.width / 2, canvasRef.current.height + fontSize + 10);
        }
      });
    }
  }, [showQRCode, name]);

  return (
    <div style={{ background: '#ffffff', textAlign: 'center' }}>
      <h1>Generate QR Code</h1>
      <button onClick={handleGenerateQRCode}>Generate QR Code</button>
      {showQRCode && <canvas ref={canvasRef} />}
    </div>
  );
};
};

export default QRCodeGenerator;