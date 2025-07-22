import React, { useState } from 'react';
import { QrCode, Scan, Users, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import QRScanner from '../../components/QRScanner';
import LoadingSpinner from '../../components/LoadingSpinner';

interface AttendanceRecord {
  id: string;
  memberName: string;
  cardNumber: string;
  prayer: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
  attendedAt: string;
}

const Attendance: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'home' | 'scanner'>('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      memberName: 'Ahmad Fauzi',
      cardNumber: 'KRT-001234',
      prayer: 'subuh',
      attendedAt: '2024-01-25T05:30:00Z'
    },
    {
      id: '2',
      memberName: 'Siti Rahmah',
      cardNumber: 'KRT-001235',
      prayer: 'dzuhur',
      attendedAt: '2024-01-25T12:15:00Z'
    },
    {
      id: '3',
      memberName: 'Budi Wijaya',
      cardNumber: 'KRT-001236',
      prayer: 'ashar',
      attendedAt: '2024-01-25T15:45:00Z'
    },
  ]);

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
      // Mock API call to submit attendance
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - randomly success or error for demo
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        // Mock member data
        const mockMember = 'Anggota ' + Math.random().toString(36).substr(2, 4);
        const currentHour = new Date().getHours();
        let prayer: AttendanceRecord['prayer'] = 'dzuhur';
        
        if (currentHour < 6) prayer = 'subuh';
        else if (currentHour < 13) prayer = 'dzuhur';
        else if (currentHour < 16) prayer = 'ashar';
        else if (currentHour < 19) prayer = 'maghrib';
        else prayer = 'isya';
        
        const newRecord: AttendanceRecord = {
          id: Date.now().toString(),
          memberName: mockMember,
          cardNumber: qrData,
          prayer: prayer,
          attendedAt: new Date().toISOString()
        };
        
        setAttendanceRecords([newRecord, ...attendanceRecords]);
        setSubmitMessage({ type: 'success', text: `Absensi ${mockMember} berhasil dicatat` });
      } else {
        setSubmitMessage({ type: 'error', text: 'Kartu tidak terdaftar atau sudah absen hari ini' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Gagal mengirim data absensi. Coba lagi.' });
    } finally {
      setIsSubmitting(false);
      
      // Auto hide message and continue scanning after 2 seconds
      setTimeout(() => {
        setSubmitMessage(null);
      }, 2000);
    }
  };

  const todayRecords = attendanceRecords.filter(record => 
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Absensi Jamaah</h1>
        <p className="text-gray-600 mt-1">Catat kehadiran jamaah dengan scan kartu anggota</p>
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {getPrayerStats().map((stat) => (
                <div key={stat.value} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.count}</p>
                  <p className="text-xs text-gray-500">{stat.time}</p>
                </div>
              ))}
            </div>
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
                  Anggota
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
              {attendanceRecords.slice(0, 10).map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{record.memberName}</div>
                        <div className="text-sm text-gray-500">{record.cardNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {record.prayer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.attendedAt).toLocaleString('id-ID')}
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