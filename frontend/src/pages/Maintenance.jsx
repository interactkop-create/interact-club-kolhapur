import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const Maintenance = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Website Under Maintenance
        </h1>
        <p className="text-gray-600 mb-4">
          We're currently performing scheduled maintenance. Please check back soon.
        </p>
        <p className="text-sm text-gray-500">
          — Interact Club of Kolhapur
        </p>
        <a 
          href="/admin/login" 
          className="inline-block mt-6 text-sm text-blue-600 hover:underline"
        >
          Admin Login
        </a>
      </div>
    </div>
  );
};
