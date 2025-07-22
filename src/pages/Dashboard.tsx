import React, { useEffect, useState } from 'react';
import { Users, Building2, CreditCard, QrCode, CheckCircle, Clock, Sun, Moon, Coffee } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Live date and time
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const tanggal = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Greeting logic
  const hour = now.getHours();
  let greeting = 'Selamat datang';
  let Icon = Sun;
  let iconClass = 'text-yellow-400 animate-bounce';
  if (hour >= 5 && hour < 11) {
    greeting = 'Selamat pagi';
    Icon = Sun;
    iconClass = 'text-yellow-400 animate-bounce';
  } else if (hour >= 11 && hour < 15) {
    greeting = 'Selamat siang';
    Icon = Coffee;
    iconClass = 'text-amber-700 animate-bounce';
  } else if (hour >= 15 && hour < 18) {
    greeting = 'Selamat sore';
    Icon = Sun;
    iconClass = 'text-orange-400 animate-spin';
  } else {
    greeting = 'Selamat malam';
    Icon = Moon;
    iconClass = 'text-blue-500 animate-pulse';
  }
  const userName = user?.name || '';

  const adminStats = [
    { title: 'Total Satgas', value: 125, icon: Users, color: 'blue' as const, trend: { value: 12, isUp: true } },
    { title: 'Total Masjid', value: 89, icon: Building2, color: 'green' as const, trend: { value: 8, isUp: true } },
    { title: 'Request Pending', value: 15, icon: Clock, color: 'yellow' as const },
    { title: 'Kartu Tercetak', value: '2.4K', icon: CreditCard, color: 'purple' as const },
  ];

  const satgasStats = [
    { title: 'Anggota Terdaftar', value: 234, icon: Users, color: 'blue' as const, trend: { value: 15, isUp: true } },
    { title: 'Absensi Hari Ini', value: 87, icon: QrCode, color: 'green' as const },
    { title: 'Kartu Tersisa', value: 45, icon: CreditCard, color: 'yellow' as const },
    { title: 'Request Disetujui', value: 12, icon: CheckCircle, color: 'purple' as const },
  ];

  const stats = user?.role === 'admin' ? adminStats : satgasStats;

  return (
    <div className="space-y-6">
      {/* Live Date & Time */}
      <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-xl shadow mb-6">
        <div className="flex items-center mb-2">
          <Icon className={`h-10 w-10 mr-3 ${iconClass}`} />
          <span className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wide">
            {greeting}{userName && `, ${userName}`}!
          </span>
        </div>
        <div className="text-lg md:text-xl text-gray-700 mb-2">{tanggal}</div>
        <div className="text-4xl md:text-5xl font-mono font-extrabold text-blue-700 animate-pulse">{jam}</div>
      </div>

      {/*
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Ringkasan aktivitas dan statistik {user?.role === 'admin' ? 'sistem' : 'masjid Anda'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Terbaru</h3>
            <div className="space-y-3">
              {[
                { type: 'Satgas', name: 'Ahmad Wijaya', time: '2 jam lalu' },
                { type: 'Masjid', name: 'Masjid Al-Ikhlas', time: '4 jam lalu' },
                { type: 'Edit Masjid', name: 'Masjid An-Nur', time: '6 jam lalu' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      */}

      {/* {user?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Terbaru</h3>
            <div className="space-y-3">
              {[
                { type: 'Satgas', name: 'Ahmad Wijaya', time: '2 jam lalu' },
                { type: 'Masjid', name: 'Masjid Al-Ikhlas', time: '4 jam lalu' },
                { type: 'Edit Masjid', name: 'Masjid An-Nur', time: '6 jam lalu' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-3">
              {[
                { action: 'Satgas baru disetujui', user: 'Budi Santoso', time: '1 jam lalu' },
                { action: 'Masjid baru disetujui', user: 'Masjid Al-Barokah', time: '3 jam lalu' },
                { action: 'Request kartu disetujui', user: 'Siti Aminah', time: '5 jam lalu' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.action}</p>
                    <p className="text-sm text-gray-500">{item.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {user?.role === 'satgas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Absensi Hari Ini</h3>
            <div className="space-y-3">
              {[
                { prayer: 'Subuh', count: 15, time: '05:30' },
                { prayer: 'Dzuhur', count: 23, time: '12:15' },
                { prayer: 'Ashar', count: 28, time: '15:45' },
                { prayer: 'Maghrib', count: 21, time: '18:20' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Sholat {item.prayer}</p>
                    <p className="text-sm text-gray-500">{item.count} jamaah</p>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrasi Terbaru</h3>
            <div className="space-y-3">
              {[
                { name: 'Ahmad Fauzi', card: 'KRT-001234', time: '2 jam lalu' },
                { name: 'Siti Rahmah', card: 'KRT-001235', time: '4 jam lalu' },
                { name: 'Budi Wijaya', card: 'KRT-001236', time: '6 jam lalu' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.card}</p>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Dashboard;