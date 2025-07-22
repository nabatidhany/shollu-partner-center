import React, { useState } from 'react';
import { QrCode, UserPlus, Scan, CheckCircle } from 'lucide-react';
import QRScanner from '../../components/QRScanner';

const MemberRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'scan' | 'scanner' | 'form'>('scan');
  const [cardNumber, setCardNumber] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'L',
    birthDate: ''
  });

  const handleStartScan = () => {
    setCurrentStep('scanner');
  };

  const handleQrScan = (qrData: string) => {
    setCardNumber(qrData);
    setCurrentStep('form');
  };

  const handleCloseScan = () => {
    setCurrentStep('scan');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration
    alert('Anggota berhasil didaftarkan!');
    setCurrentStep('scan');
    setCardNumber('');
    setFormData({ name: '', phone: '', gender: 'L', birthDate: '' });
  };

  const handleBackToScan = () => {
    setCurrentStep('scan');
    setCardNumber('');
    setFormData({ name: '', phone: '', gender: 'L', birthDate: '' });
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registrasi Anggota</h1>
        <p className="text-gray-600 mt-1">Daftarkan anggota baru dengan scan QR kartu kosong</p>
      </div>

      {currentStep === 'scan' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center">
              <QrCode className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Scan QR Kartu Kosong</h3>
            <p className="mt-2 text-gray-600">
              Scan QR code pada kartu kosong untuk memulai proses registrasi anggota baru
            </p>
            <button
              onClick={handleStartScan}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Scan className="mr-2 h-5 w-5" />
              Mulai Scan
            </button>
          </div>
        </div>
      )}

      {currentStep === 'scanner' && (
        <QRScanner
          onScan={handleQrScan}
          onClose={handleCloseScan}
          title="Scan QR Kartu Kosong"
          subtitle="Arahkan kamera ke QR code pada kartu kosong"
        />
      )}

      {currentStep === 'form' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Kartu Berhasil di Scan</h3>
                <p className="text-sm text-gray-600">Nomor Kartu: {cardNumber}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor HP *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin *
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir *
                </label>
                <input
                  type="date"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleBackToScan}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Daftarkan Anggota
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MemberRegistration;