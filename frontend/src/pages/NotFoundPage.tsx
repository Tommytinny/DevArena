import React from "react";
import { Home } from 'lucide-react';
import { Link } from "react-router-dom";


const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* SVG Illustration */}
      <div className="w-full max-w-lg animate-float">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" className="w-full">
          {/* Background */}
          <rect width="800" height="400" fill="#f8f9fa"/>
          
          {/* Lost astronaut character */}
          <g transform="translate(400, 200)">
            {/* Space helmet */}
            <circle cx="0" cy="0" r="40" fill="#ffffff" stroke="#333333" strokeWidth="4"/>
            <circle cx="10" cy="-5" r="5" fill="#e0e0e0"/> {/* Helmet reflection */}
            
            {/* Astronaut body */}
            <rect x="-30" y="40" width="60" height="80" rx="20" fill="#ffffff" stroke="#333333" strokeWidth="4"/>
            
            {/* Arms */}
            <rect x="-60" y="50" width="30" height="20" rx="10" fill="#ffffff" stroke="#333333" strokeWidth="4"/>
            <rect x="30" y="50" width="30" height="20" rx="10" fill="#ffffff" stroke="#333333" strokeWidth="4"/>
            
            {/* Legs */}
            <rect x="-25" y="120" width="20" height="40" rx="10" fill="#ffffff" stroke="#333333" strokeWidth="4"/>
            <rect x="5" y="120" width="20" height="40" rx="10" fill="#ffffff" stroke="#333333" strokeWidth="4"/>
          </g>
          
          {/* 404 Text */}
          <text x="400" y="300" fontFamily="Arial" fontSize="120" fontWeight="bold" fill="#333333" textAnchor="middle">404</text>
          
          {/* Floating elements */}
          <g className="animate-pulse">
            {/* Stars */}
            <circle cx="200" cy="100" r="4" fill="#333333"/>
            <circle cx="600" cy="150" r="4" fill="#333333"/>
            <circle cx="300" cy="80" r="4" fill="#333333"/>
            <circle cx="500" cy="120" r="4" fill="#333333"/>
            
            {/* Planets */}
            <circle cx="150" cy="150" r="20" fill="#6c757d"/>
            <circle cx="650" cy="100" r="30" fill="#6c757d"/>
          </g>
        </svg>
      </div>

      {/* Text Content */}
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        
        {/* Home Button */}
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
};

export default NotFound;
