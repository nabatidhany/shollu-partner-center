import React, { useRef, useState } from 'react';
import { QrCode, Scan, Users, CheckCircle, AlertCircle } from 'lucide-react';
import QRScanner from '../../components/QRScanner';
import LoadingSpinner from '../../components/LoadingSpinner';
import { submitAttendanceQr } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import { getStatistikAbsenSatgas } from '../../api/auth';
import { useEffect } from 'react';

const EVENT_OPTIONS = [
  { id: 3, label: 'Sholat Champions' },
];

interface AttendanceRecord {
  id: string;
  memberName: string;
  cardNumber: string;
  prayer: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
  attendedAt: string;
}

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [eventId, setEventId] = useState(3);
  const [currentStep, setCurrentStep] = useState<'home' | 'scanner'>('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [dialog, setDialog] = useState<null | { type: 'success' | 'error', data: any }>(null);
  const [statistik, setStatistik] = useState<{ total_per_sholat: any; latest_absensi: any[] }>({ total_per_sholat: {}, latest_absensi: [] });
  const [statistikLoading, setStatistikLoading] = useState(true);
  const [statistikError, setStatistikError] = useState<string | null>(null);
  // Audio refs
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const errorAudioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    setStatistikLoading(true);
    getStatistikAbsenSatgas()
      .then(res => {
        setStatistik(res.data);
        setStatistikError(null);
      })
      .catch(err => {
        setStatistikError('Gagal memuat statistik');
      })
      .finally(() => setStatistikLoading(false));
  }, []);

  const refreshStatistik = () => {
    setStatistikLoading(true);
    getStatistikAbsenSatgas()
      .then(res => {
        setStatistik(res.data);
        setStatistikError(null);
      })
      .catch(err => {
        setStatistikError('Gagal memuat statistik');
      })
      .finally(() => setStatistikLoading(false));
  };

  const handleStartScan = () => {
    setCurrentStep('scanner');
  };

  const handleCloseScan = () => {
    setCurrentStep('home');
  };

  const handleQrScan = async (qrData: string) => {
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const res = await submitAttendanceQr({
        qr_code: qrData,
        mesin_id: user?.id || '',
        event_id: eventId,
      });
      if (res.fullname) {
        setDialog({ type: 'success', data: res });
        successAudioRef.current?.play();
        refreshStatistik();
      } else if (res.error) {
        errorAudioRef.current?.play();
        setDialog({ type: 'error', data: res });
      } else if (res.success === false && res.message) {
        errorAudioRef.current?.play();
        setDialog({ type: 'error', data: { error: res.message } });
      } else {
        errorAudioRef.current?.play();
        setDialog({ type: 'error', data: { error: 'Absensi gagal' } });
      }
    } catch (error: any) {
      errorAudioRef.current?.play();
      setDialog({ type: 'error', data: { error: error?.response?.data?.error || error?.response?.data?.message || 'Gagal mengirim data absensi. Coba lagi.' } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayRecords = statistik.latest_absensi.filter(record => 
    new Date(record.attendedAt).toDateString() === new Date().toDateString()
  );

  const getPrayerStats = () => {
    const prayers = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
    const prayerLabels = {
      subuh: { label: 'Subuh', time: '05:30' },
      dzuhur: { label: 'Dzuhur', time: '12:15' },
      ashar: { label: 'Ashar', time: '15:45' },
      maghrib: { label: 'Maghrib', time: '18:20' },
      isya: { label: 'Isya', time: '19:45' }
    };
    
    return prayers.map(prayer => ({
      value: prayer,
      label: prayerLabels[prayer as keyof typeof prayerLabels].label,
      time: prayerLabels[prayer as keyof typeof prayerLabels].time,
      count: todayRecords.filter(record => record.prayer === prayer).length
    }));
  };

  // Auto close dialog after 500ms
  useEffect(() => {
    if (dialog) {
      const timer = setTimeout(() => setDialog(null), 500);
      return () => clearTimeout(timer);
    }
  }, [dialog]);

  return (
    <div className="space-y-6">
      {/* Audio Elements */}
      <audio ref={successAudioRef} src="/sound/success.wav" />
      <audio ref={errorAudioRef} src="/sound/error.wav" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Absensi Jamaah</h1>
        <p className="text-gray-600 mt-1">Catat kehadiran jamaah dengan scan kartu anggota</p>
      </div>

      {/* Event Dropdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Event</label>
        <select
          value={eventId}
          onChange={e => setEventId(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {EVENT_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {currentStep === 'home' && (
        <>
          {/* Scan Card Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <QrCode className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Scan Kartu Anggota</h3>
              <p className="text-gray-600 mb-6">
                Scan kartu anggota untuk mencatat kehadiran sholat
              </p>
              <button
                onClick={handleStartScan}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Scan className="mr-2 h-5 w-5" />
                Mulai Scan
              </button>
            </div>
          </div>

          {/* Today's Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistik Hari Ini</h3>
            {statistikLoading ? (
              <div>Loading...</div>
            ) : statistikError ? (
              <div className="text-red-600">{statistikError}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map((prayer) => (
                  <div key={prayer} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">{prayer.charAt(0).toUpperCase() + prayer.slice(1)}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{statistik.total_per_sholat[prayer] ?? 0}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {currentStep === 'scanner' && (
        <QRScanner
          onScan={handleQrScan}
          onClose={handleCloseScan}
          title="Scan Kartu Anggota"
          subtitle="Arahkan kamera ke QR code pada kartu anggota"
        />
      )}

      {/* Loading Spinner */}
      {isSubmitting && (
        <LoadingSpinner message="Mengirim data absensi..." />
      )}

      {/* Success/Error Message */}
      {submitMessage && (
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
            submitMessage.type === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {submitMessage.type === 'success' ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <p className={`text-lg font-medium ${
            submitMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {submitMessage.text}
          </p>
        </div>
      )}

      {/* Konfirmasi Dialog Modal */}
      {dialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            {dialog.type === 'success' ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mb-2 mx-auto" />
                <h2 className="text-xl font-bold mb-2 text-gray-900">Absensi Berhasil</h2>
                <div className="mb-2 text-gray-700">
                  <div><b>Nama:</b> {dialog.data.fullname}</div>
                  <div><b>Event:</b> {EVENT_OPTIONS.find(e => e.id === dialog.data.event_id)?.label || dialog.data.event_id}</div>
                  <div><b>Waktu Sholat:</b> {dialog.data.tag}</div>
                  <div><b>QR Code:</b> {dialog.data.qr_code}</div>
                </div>
                <div className="text-green-700 mb-2">{dialog.data.message}</div>
              </>
            ) : (
              <>
                <AlertCircle className="h-12 w-12 text-red-500 mb-2 mx-auto" />
                <h2 className="text-xl font-bold mb-2 text-gray-900">Absensi Gagal</h2>
                <div className="text-red-700 mb-2">{dialog.data.error}</div>
              </>
            )}
            <button
              onClick={() => setDialog(null)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Absensi Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Sholat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Absen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statistik.latest_absensi.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8">Belum ada absensi hari ini</td></tr>
              ) : statistik.latest_absensi.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{record.fullname || '-'}</div>
                        <div className="text-sm text-gray-500">ID: {record.user_id || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {record.tag || '-'}
                  </td>
                  <td className="...">
                    {record.waktu
                      ? new Date(record.waktu.replace('Z', '')).toLocaleTimeString('id-ID', {
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        }).replace(/:/g, '.')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Hadir
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;