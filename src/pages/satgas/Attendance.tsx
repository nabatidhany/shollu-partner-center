import React, { useRef, useState, useEffect } from 'react';
import { QrCode, Scan, Users, CheckCircle, AlertCircle, Plus, BookOpen } from 'lucide-react';
import QRScanner from '../../components/QRScanner';
import LoadingSpinner from '../../components/LoadingSpinner';
import { submitAttendanceQr } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import { getStatistikAbsenSatgas } from '../../api/auth';
import axios from 'axios';


interface AttendanceRecord {
  id: string;
  memberName: string;
  cardNumber: string;
  prayer: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
  attendedAt: string;
}



const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [eventOptions, setEventOptions] = useState<{ id_event: number; nama: string }[]>([]);
  const [eventId, setEventId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<'home' | 'scanner'>('home');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [dialog, setDialog] = useState<null | { type: 'success' | 'error', data: any }>(null);
  const [statistik, setStatistik] = useState<{ total_per_sholat: any; latest_absensi: any[] }>({ total_per_sholat: {}, latest_absensi: [] });
  const [statistikLoading, setStatistikLoading] = useState(true);
  const [statistikError, setStatistikError] = useState<string | null>(null);
  
  // Pejuang Quran specific states
  const [showVerseDialog, setShowVerseDialog] = useState(false);
  const [verseInput, setVerseInput] = useState<string>('');
  const [lastReadVerse, setLastReadVerse] = useState<string>('');
  const [isSubmittingVerses, setIsSubmittingVerses] = useState(false);
  const [scannedQrData, setScannedQrData] = useState<string>('');
  const [pejuangQuranHistory, setPejuangQuranHistory] = useState<any[]>([]);
  // Tambahkan state untuk surat search dan ayat
  const [suratOptions, setSuratOptions] = useState<any[]>([]);
  const [suratSearch, setSuratSearch] = useState('');
  const [selectedSurat, setSelectedSurat] = useState<any>(null);
  const [ayatNumber, setAyatNumber] = useState<number | ''>('');
  const [isLoadingSurat, setIsLoadingSurat] = useState(false);
  const [pesertaInfo, setPesertaInfo] = useState<{ peserta_id?: number; nama?: string; terakhir?: any } | null>(null);
  const [isLoadingPeserta, setIsLoadingPeserta] = useState(false);
  // Fetch Pejuang Quran history from API
  useEffect(() => {
    const fetchHistory = async () => {
      if (eventId !== 1 || currentStep !== 'home') return;
      try {
        const token = localStorage.getItem('shollu_token');
        const res = await axios.get('https://app.shollu.com/api/partners/pejuang-quran/riwayat', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setPejuangQuranHistory(res.data.data);
        } else {
          setPejuangQuranHistory([]);
        }
      } catch (err) {
        setPejuangQuranHistory([]);
      }
    };
    fetchHistory();
  }, [eventId, currentStep]);
  const [verseSuggestions, setVerseSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // Audio refs
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const errorAudioRef = useRef<HTMLAudioElement>(null);
  
  // Mock function to get last read verse
  const getLastReadVerse = async (qrCode: string) => {
    // Mock API call - replace with actual API when ready
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('');
      }, 500);
    });
  };

  // Mock function to get verse suggestions
  const getVerseSuggestions = async (query: string) => {
    // Mock API call - replace with actual API when ready
    return new Promise<string[]>((resolve) => {
      setTimeout(() => {
        const mockSuggestions = [
          'Al-Baqarah: 255 (Ayat Kursi)',
          'Al-Baqarah: 1-5 (Alif Lam Mim)',
          'Al-Baqarah: 285-286 (Akhir Surat Al-Baqarah)',
          'Ali Imran: 8-9 (Doa Memohon Petunjuk)',
          'Ali Imran: 26-27 (Doa Memohon Kekuasaan)',
          'Al-A\'raf: 23 (Doa Taubat)',
          'Al-A\'raf: 47 (Doa Memohon Ampunan)',
          'Yunus: 10 (Doa Memohon Rahmat)',
          'Hud: 47 (Doa Nabi Nuh)',
          'Yusuf: 101 (Doa Nabi Yusuf)',
          'Ibrahim: 40-41 (Doa Nabi Ibrahim)',
          'Maryam: 4-6 (Doa Nabi Zakaria)',
          'Ta Ha: 25-28 (Doa Nabi Musa)',
          'Al-Furqan: 74 (Doa Orang Beriman)',
          'Al-Ahzab: 56 (Shalawat)',
          'Fatir: 15 (Doa Memohon Pertolongan)',
          'Al-Muzzammil: 9-10 (Doa Nabi Muhammad)',
          'Al-Insan: 9 (Doa Memohon Keselamatan)',
          'Al-A\'la: 14-15 (Doa Memohon Keberhasilan)',
          'Al-Ghashiyah: 21-22 (Doa Memohon Petunjuk)'
        ];
        
        const filtered = mockSuggestions.filter(suggestion => 
          suggestion.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered.slice(0, 10)); // Limit to 10 suggestions
      }, 300);
    });
  };

  // Mock function to submit verses
  const submitVerses = async (qrCode: string, verses: string[]) => {
    // Mock API call to /pejuang-quran - replace with actual API when ready
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Ayat berhasil disimpan!'
        });
      }, 1000);
    });
  };

  // Fungsi search surat ke API
  const suratSearchDebounce = useRef<number | null>(null);

  const handleSuratSearch = (search: string) => {
    setSuratSearch(search);
    if (suratSearchDebounce.current) {
      clearTimeout(suratSearchDebounce.current);
    }
    if (!search) {
      setSuratOptions([]);
      return;
    }
    setIsLoadingSurat(true);
    suratSearchDebounce.current = window.setTimeout(async () => {
      try {
        const token = localStorage.getItem('shollu_token');
        const res = await axios.get(`https://app.shollu.com/api/partners/surat/search?search=${encodeURIComponent(search)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setSuratOptions(res.data.data);
        } else {
          setSuratOptions([]);
        }
      } catch (err) {
        setSuratOptions([]);
      } finally {
        setIsLoadingSurat(false);
      }
    }, 300);
  };

  // Reset surat/ayat saat modal dibuka/ditutup
  useEffect(() => {
    if (showVerseDialog) {
      setSuratSearch('');
      setSuratOptions([]);
      setSelectedSurat(null);
      setAyatNumber('');
    }
  }, [showVerseDialog]);

  // Fetch peserta info & last ayat when modal opens
  useEffect(() => {
    if (showVerseDialog && scannedQrData) {
      const fetchPeserta = async () => {
        setIsLoadingPeserta(true);
        try {
          const token = localStorage.getItem('shollu_token');
          const res = await axios.get(`https://app.shollu.com/api/partners/pejuang-quran/log?qrcode=${encodeURIComponent(scannedQrData)}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (res.data && res.data.success && res.data.data) {
            setPesertaInfo(res.data.data);
          } else {
            setPesertaInfo(null);
          }
        } catch (err) {
          setPesertaInfo(null);
        } finally {
          setIsLoadingPeserta(false);
        }
      };
      fetchPeserta();
    } else if (!showVerseDialog) {
      setPesertaInfo(null);
    }
  }, [showVerseDialog, scannedQrData]);

  // Submit Pejuang Quran
  const handleVerseSubmit = async () => {
    if (!selectedSurat || !selectedSurat.id) {
      alert('Pilih surat terlebih dahulu');
      return;
    }
    if (!ayatNumber || isNaN(Number(ayatNumber)) || Number(ayatNumber) < 1) {
      alert('Masukkan nomor ayat yang valid');
      return;
    }
    if (!pesertaInfo?.peserta_id) {
      alert('Data peserta tidak ditemukan');
      return;
    }
    setIsSubmittingVerses(true);
    try {
      const token = localStorage.getItem('shollu_token');
      // tanggal format: 27 Juli 2025 14:30
      const now = new Date();
      const tanggal = `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('id-ID', { month: 'long' })} ${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const body = {
        id_peserta: pesertaInfo.peserta_id,
        tanggal,
        id_surat: selectedSurat.id,
        ayat: Number(ayatNumber),
      };
      await axios.post('https://app.shollu.com/api/partners/pejuang-quran', body, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      successAudioRef.current?.play();
      setDialog({ type: 'success', data: { message: 'Ayat berhasil disimpan!' } });
      setShowVerseDialog(false);
      setSuratSearch('');
      setSuratOptions([]);
      setSelectedSurat(null);
      setAyatNumber('');
      refreshStatistik();
    } catch (error: any) {
      errorAudioRef.current?.play();
      setDialog({ type: 'error', data: { error: 'Gagal menyimpan ayat. Coba lagi.' } });
    } finally {
      setIsSubmittingVerses(false);
    }
  };

  const resetVerseDialog = () => {
    setShowVerseDialog(false);
    setVerseInput('');
    setLastReadVerse('');
    setScannedQrData('');
    setVerseSuggestions([]);
    setShowSuggestions(false);
  };

  // Debounced function to fetch suggestions
  const debouncedFetchSuggestions = useRef<number | null>(null);

  const handleVerseInputChange = (value: string) => {
    setVerseInput(value);
    setShowSuggestions(true);

    // Clear previous timeout
    if (debouncedFetchSuggestions.current) {
      clearTimeout(debouncedFetchSuggestions.current);
    }

    // Don't fetch if input is too short
    if (value.length < 2) {
      setVerseSuggestions([]);
      return;
    }

    // Debounce the API call
    debouncedFetchSuggestions.current = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const suggestions = await getVerseSuggestions(value);
        setVerseSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setVerseSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setVerseInput(suggestion);
    setShowSuggestions(false);
    setVerseSuggestions([]);
  };

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

  // Fetch event options from API on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('shollu_token');
        const res = await axios.get('https://app.shollu.com/api/partners/petugas/event-satgas', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setEventOptions(res.data.data);
          if (res.data.data.length > 0) {
            setEventId(res.data.data[0].id_event);
          }
        }
      } catch (err) {
        setEventOptions([]);
      }
    };
    fetchEvents();
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
    if (eventId === null) return;
    if (eventId === 1) {
      // Pejuang Quran event - show verse input dialog
      setScannedQrData(qrData);
      setIsSubmitting(true);
      try {
        const lastVerse = await getLastReadVerse(qrData);
        setLastReadVerse(lastVerse);
        setShowVerseDialog(true);
      } catch (error) {
        errorAudioRef.current?.play();
        setDialog({ type: 'error', data: { error: 'Gagal memuat data ayat terakhir' } });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Regular attendance flow for other events
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debouncedFetchSuggestions.current) {
        clearTimeout(debouncedFetchSuggestions.current);
      }
      if (suratSearchDebounce.current) {
        clearTimeout(suratSearchDebounce.current);
      }
    };
  }, []);

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
          value={String(eventId ?? eventOptions[0]?.id_event ?? '')}
          onChange={e => setEventId(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {eventOptions.map(opt => (
            <option key={opt.id_event} value={opt.id_event}>{opt.nama}</option>
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
          {eventId !== 1 && (
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
          )}
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
        <LoadingSpinner message={eventId === 1 ? "Memuat data ayat..." : "Mengirim data absensi..."} />
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
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  {eventId === 1 ? 'Ayat Berhasil Disimpan' : 'Absensi Berhasil'}
                </h2>
                {eventId === 1 ? (
                  <div className="text-green-700 mb-2">{dialog.data.message}</div>
                ) : (
                  <>
                    <div className="mb-2 text-gray-700">
                      <div><b>Nama:</b> {dialog.data.fullname}</div>
                      <div><b>Event:</b> {eventOptions.find(e => e.id_event === dialog.data.event_id)?.nama || dialog.data.event_id}</div>
                      <div><b>Waktu Sholat:</b> {dialog.data.tag}</div>
                      <div><b>QR Code:</b> {dialog.data.qr_code}</div>
                    </div>
                    <div className="text-green-700 mb-2">{dialog.data.message}</div>
                  </>
                )}
              </>
            ) : (
              <>
                <AlertCircle className="h-12 w-12 text-red-500 mb-2 mx-auto" />
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  {eventId === 1 ? 'Gagal Menyimpan Ayat' : 'Absensi Gagal'}
                </h2>
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

      {/* Pejuang Quran Verse Input Dialog */}
      {showVerseDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Input Ayat Quran</h2>
              <p className="text-gray-600">Pilih surat dan ayat yang telah dibaca</p>
            </div>
            {/* Peserta Info */}
            {isLoadingPeserta ? (
              <div className="mb-4 text-center text-gray-500">Memuat data peserta...</div>
            ) : pesertaInfo && (
              <div className="mb-4 text-center">
                <div className="text-sm text-gray-700 font-semibold">{pesertaInfo.nama}</div>
                {pesertaInfo.terakhir ? (
                  <div className="text-xs text-gray-600 mt-1">
                    Terakhir: {pesertaInfo.terakhir.surat_nama} ayat {pesertaInfo.terakhir.ayat} <span className="text-gray-400">({new Date(pesertaInfo.terakhir.tanggal).toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })})</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 mt-1 italic">Belum ada riwayat ayat terakhir</div>
                )}
              </div>
            )}
            {/* Last Read Verse Info */}
            {lastReadVerse && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Ayat Terakhir yang Dibaca:</h3>
                <p className="text-blue-700">{lastReadVerse}</p>
              </div>
            )}
            {/* Surat Select with Search */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Surat</label>
              <input
                type="text"
                value={suratSearch}
                onChange={e => handleSuratSearch(e.target.value)}
                placeholder="Cari surat..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {isLoadingSurat && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                </div>
              )}
              {suratSearch.length > 0 && suratOptions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {suratOptions.map((surat: any) => (
                    <button
                      key={surat.id}
                      type="button"
                      onClick={() => { setSelectedSurat(surat); setSuratSearch(surat.name_id); setSuratOptions([]); }}
                      className={`w-full text-left px-4 py-2 text-sm ${selectedSurat && selectedSurat.id === surat.id ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}
                    >
                      {surat.number}. {surat.name_id} ({surat.number_of_verses} ayat)
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Selected Surat Info */}
            {selectedSurat && (
              <div className="mb-4 text-sm text-green-700">Surat terpilih: {selectedSurat.number}. {selectedSurat.name_id}</div>
            )}
            {/* Ayat Number Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ayat ke berapa</label>
              <input
                type="number"
                min={1}
                max={selectedSurat?.number_of_verses || 286}
                value={ayatNumber}
                onChange={e => setAyatNumber(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Masukkan nomor ayat"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {selectedSurat && selectedSurat.number_of_verses && (
                <div className="text-xs text-gray-500 mt-1">Jumlah ayat surat ini: {selectedSurat.number_of_verses}</div>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={resetVerseDialog}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleVerseSubmit}
                disabled={isSubmittingVerses}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingVerses ? 'Menyimpan...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {eventId === 1 ? 'Riwayat Terbaru' : 'Absensi Terbaru'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          {eventId === 1 ? (
            // Pejuang Quran History Table
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Surat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ayat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pejuangQuranHistory.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8">Belum ada riwayat ayat yang dibaca</td></tr>
                ) : pejuangQuranHistory.map((record: any) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{record.peserta_nama || '-'}</div>
                          <div className="text-sm text-gray-500">ID: {record.peserta_id || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.surat_nama || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.ayat || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.tanggal ? new Date(record.tanggal).toLocaleString('id-ID', {
                        year: 'numeric', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                        hour12: false
                      }).replace(/\//g, '-') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Tersimpan
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Regular Attendance Table
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;