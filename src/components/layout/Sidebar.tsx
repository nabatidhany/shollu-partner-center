import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building2, 
  CreditCard, 
  UserPlus, 
  QrCode,
  PrinterIcon,
  ClipboardList,
  Settings,
  CheckSquare,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
    }
  };

  const adminMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/satgas-management', icon: Users, label: 'Manajemen Satgas' },
    { path: '/satgas-requests', icon: UserCheck, label: 'Request Satgas' },
    { path: '/card-print-requests', icon: PrinterIcon, label: 'Request Cetak Kartu' },
    // { path: '/masjid-requests', icon: Building2, label: 'Request Masjid' },
    // { path: '/masjid-edit-requests', icon: Settings, label: 'Edit Masjid' },
    { path: '/member-list', icon: ClipboardList, label: 'Daftar Anggota' },
  ];

  const satgasMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/card-request', icon: CreditCard, label: 'Request Kartu' },
    { path: '/member-registration', icon: UserPlus, label: 'Registrasi Anggota' },
    { path: '/attendance', icon: QrCode, label: 'Absensi' },
    { path: '/kehadiran-pejuang-quran', icon: CheckSquare, label: 'Kehadiran Pejuang Quran' },
    // { path: '/print-cards', icon: PrinterIcon, label: 'Cetak Kartu' },
    { path: '/member-list', icon: ClipboardList, label: 'Daftar Anggota' },
    // { path: '/masjid-management', icon: Building2, label: 'Manajemen Masjid' },
    // { path: '/settings', icon: Settings, label: 'Pengaturan' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : satgasMenuItems;

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in">
          <span>Install aplikasi ini di perangkat Anda untuk pengalaman lebih baik!</span>
          <button
            onClick={handleInstallClick}
            className="ml-4 px-4 py-2 bg-white text-blue-600 rounded shadow hover:bg-blue-100 font-semibold"
          >
            Install
          </button>
        </div>
      )}
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md border border-gray-200"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 min-h-screen transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 lg:p-6">
          <img src="/logo.svg" alt="Logo" className="h-10 w-auto mb-2 mx-auto" />
          <h1 className="text-lg lg:text-xl font-bold text-gray-800">Shollu Partner Center</h1>
          <p className="text-xs lg:text-sm text-gray-500 mt-1">
            {user?.role === 'admin' ? 'Admin Panel' : 'Satgas Panel'}
          </p>
        </div>
        
        <nav className="mt-6 lg:mt-8">
          <div className="px-4 lg:px-6 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu Utama
            </p>
          </div>
          
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 lg:px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;