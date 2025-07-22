import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  title: string;
  subtitle?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, title, subtitle }) => {
  const [error, setError] = useState<string>('');

  const handleScan = (result: any) => {
    if (result && result[0]?.rawValue) {
      onScan(result[0].rawValue);
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner Error:', error);
    setError('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
  };

  const handleManualInput = () => {
    const manualCode = prompt('Masukkan kode QR secara manual:');
    if (manualCode) {
      onScan(manualCode);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          {error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleManualInput}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Input Manual
              </button>
            </div>
          ) : (
            <div className="relative">
              <Scanner
                onScan={handleScan}
                onError={handleError}
                constraints={{
                  facingMode: 'environment'
                }}
                styles={{
                  container: {
                    width: '100%',
                    height: '300px',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }
                }}
              />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white rounded-lg shadow-lg">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Arahkan kamera ke QR code untuk memindai
            </p>
            <button
              onClick={handleManualInput}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Input kode secara manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;