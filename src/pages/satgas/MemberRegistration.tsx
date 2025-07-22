import React, { useState } from 'react';
import { QrCode, UserPlus, Scan, CheckCircle } from 'lucide-react';
import QRScanner from '../../components/QRScanner';
import { registerPeserta } from '../../api/auth';

const EVENT_OPTIONS = [
  { id: 3, label: 'Sholat Champions' },
];

const MemberRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'scan' | 'scanner' | 'form'>('scan');
  const [cardNumber, setCardNumber] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: 'male' as 'male' | 'female',
    birthDate: '',
    eventId: 3,
    isHideName: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await registerPeserta({
        fullname: formData.name,
        contact: formData.phone,
        gender: formData.gender,
        dob: formData.birthDate,
        qr_code: cardNumber,
        id_event: formData.eventId,
        is_hide_name: formData.isHideName,
      });
      if (res.success) {
        setSuccess('Anggota berhasil didaftarkan!');
        setCurrentStep('scan');
        setCardNumber('');
        setFormData({ name: '', phone: '', gender: 'male', birthDate: '', eventId: 3, isHideName: false });
      } else {
        setError(res.message || 'Gagal mendaftar');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal mendaftar');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToScan = () => {
    setCurrentStep('scan');
    setCardNumber('');
    setFormData({ name: '', phone: '', gender: 'male', birthDate: '', eventId: 3, isHideName: false });
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Event *</label>
              <select
                value={formData.eventId}
                onChange={e => setFormData({ ...formData, eventId: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {EVENT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
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
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
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
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="isHideName"
                checked={formData.isHideName}
                onChange={e => setFormData({ ...formData, isHideName: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isHideName" className="text-sm text-gray-700">Sembunyikan Nama di Leaderboard</label>
            </div>
            {success && <div className="bg-green-100 text-green-700 p-2 rounded text-center">{success}</div>}
            {error && <div className="bg-red-100 text-red-700 p-2 rounded text-center">{error}</div>}
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
                disabled={loading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {loading ? 'Mendaftarkan...' : 'Daftarkan Anggota'}
              </button>
            </div>
          </form>
        </div>
      )}
      {success && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <div className="flex flex-col items-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <h2 className="text-xl font-bold mb-2 text-gray-900">Registrasi Berhasil!</h2>
              <p className="text-gray-700">{success}</p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Kembali ke Scan Kartu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberRegistration;