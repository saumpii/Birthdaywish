'use client';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const CARD_TEMPLATES = {
    '1': {
      name: "Colorful Balloons",
      background: "bg-gradient-to-br from-pink-400 via-purple-300 to-indigo-400",
      style: {
        backgroundImage: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)"
      }
    },
    '2': {
      name: "Cake & Confetti",
      background: "bg-gradient-to-br from-yellow-300 via-pink-400 to-rose-400",
      style: {
        backgroundImage: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)"
      }
    },
    '3': {
      name: "Party Animals",
      background: "bg-gradient-to-br from-green-300 via-emerald-400 to-teal-400",
      style: {
        backgroundImage: "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)"
      }
    },
    '4': {
      name: "Elegant Flowers",
      background: "bg-gradient-to-br from-rose-300 via-fuchsia-300 to-indigo-300",
      style: {
        backgroundImage: "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)"
      }
    }
  };

  const CardPreview = ({ selectedTemplate, backgroundImage, previewUrl, generatedWish, isLoading }) => {
    const cardRef = useRef(null);
    const template = CARD_TEMPLATES[selectedTemplate];
  
    const downloadCard = () => {
      if (cardRef.current) {
        html2canvas(cardRef.current).then(canvas => {
          const link = document.createElement('a');
          link.download = 'birthday-card.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      }
    };
  
    return (
      <div className="w-full md:w-1/2 flex flex-col items-center gap-4">
        <div 
          ref={cardRef}
          className="w-[360px] h-[640px] rounded-lg shadow-xl relative overflow-hidden"
          style={{
            ...(!backgroundImage && template.style),
            ...(backgroundImage && {
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${previewUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            })
          }}
        >
      {generatedWish ? (
  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
    <div >
      <div className="space-y-4 text-center">
        {generatedWish.split('\n\n').map((paragraph, i) => (
          <p 
            key={i} 
            className={`${
              i === 0 
                ? 'text-xl font-semibold' // Greeting
                : i === generatedWish.split('\n\n').length - 1 
                  ? 'text-lg italic' // Closing
                  : 'text-base' // Body
            } leading-relaxed text-gray-800`}
          >
            {paragraph.trim()}
          </p>
        ))}
      </div>
    </div>
  </div>
) : (
  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">
    {isLoading ? 'Creating your special message...' : 'Your card will appear here'}
  </div>
)}
        </div>
  
        {/* Download button - always visible when there's a generated wish */}
        {generatedWish && (
          <div className="w-full flex justify-center mt-6">
            <button
              onClick={downloadCard}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-8 rounded-full text-lg font-medium hover:opacity-90 transition-all hover:scale-105 shadow-lg flex items-center gap-2 transform hover:-translate-y-1"
            >
              <span>Download Birthday Card</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

export default function CardGenerator() {
  const [formData, setFormData] = useState({
    recipientName: '',
    memories: '',
    selectedTemplate: '1'
  });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [generatedWish, setGeneratedWish] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(file);
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateWish = async () => {
    setIsLoading(true);
    try {
      const contextPrompt = formData.memories 
        ? `Context about the person: ${formData.memories}`
        : "No specific context provided";

      const prompt = `Write a heartfelt birthday wish for ${formData.recipientName}. 
      ${contextPrompt}
      
      Requirements:
      - Keep it personal and authentic
      - Use clear paragraph breaks
      - Include specific details from the context if provided
      - Make it warm and positive
      - Keep it under 80 words strictly.
      - Format it nicely to fit in a greeting card follow this strictly.
      - Do not keep alot of spacing between lines
      - Add appropriate emojis
      - Structure it with a greeting, body, and closing
      - Make it feel like it's written by a close friend
      - Your Name - should not appear in the wish ( as we do not have the writers name)
      - Note: Structure the response with clear line breaks using \n for proper spacing.
     
      Please write the wish directly without any explanations or additional text.`;

      const response = await fetch('/api/generate-wish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate wish');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedWish(data.wish);
    } catch (error) {
      console.error('Error generating wish:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await generateWish();
  };

  return (
    <div className="min-h-[40vh] bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Your Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Birthday Star's Name
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => setFormData(prev => ({...prev, recipientName: e.target.value}))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="Enter their name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Special Memories
              </label>
              <textarea
                value={formData.memories}
                onChange={(e) => setFormData(prev => ({...prev, memories: e.target.value}))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 h-24"
                placeholder="Share some memories..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Choose Template
              </label>
              <select
                value={formData.selectedTemplate}
                onChange={(e) => setFormData(prev => ({...prev, selectedTemplate: e.target.value}))}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(CARD_TEMPLATES).map(([id, template]) => (
                  <option key={id} value={id}>{template.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Background Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-md text-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Card ✨'}
            </button>
          </form>
        </div>

        {/* Card Preview Section */}
        <CardPreview 
          selectedTemplate={formData.selectedTemplate}
          backgroundImage={backgroundImage}
          previewUrl={previewUrl}
          generatedWish={generatedWish}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}