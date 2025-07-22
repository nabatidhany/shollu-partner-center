import React from 'react';
import { Clock } from 'lucide-react';

const ComingSoon: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <Clock className="h-16 w-16 text-blue-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Coming Soon</h1>
        <p className="text-gray-600 text-center mb-4">Fitur ini sedang dalam pengembangan.<br />Silakan kembali lagi nanti!</p>
      </div>
    </div>
  );
};

export default ComingSoon; 