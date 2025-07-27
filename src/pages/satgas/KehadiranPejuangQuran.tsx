import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KehadiranPejuangQuran: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);

  // Cek akses event pejuang quran
  useEffect(() => {
    const checkAccess = async () => {
      setCheckingAccess(true);
      setHasAccess(null);
      setRequestMessage(null);
      try {
        const token = localStorage.getItem('shollu_token');
        const res = await axios.get('https://app.shollu.com/api/partners/petugas/event-satgas', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          const found = res.data.data.find((e: any) => e.id_event === 1);
          setHasAccess(!!found);
        } else {
          setHasAccess(false);
        }
      } catch (err) {
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };
    checkAccess();
  }, []);

  // Request akses Pejuang Quran
  const handleRequest = async () => {
    setRequesting(true);
    setRequestMessage(null);
    try {
      const token = localStorage.getItem('shollu_token');
      await axios.post('https://app.shollu.com/api/partners/petugas/request-pejuang-quran', {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setRequestMessage('Request berhasil dikirim. Silakan menunggu di-approve admin.');
    } catch (err) {
      setRequestMessage('Gagal mengirim request. Coba lagi nanti.');
    } finally {
      setRequesting(false);
    }
  };

  // Fetch data jika sudah punya akses
  const fetchData = async (pageNum: number, limitNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('shollu_token');
      const res = await axios.get(`https://app.shollu.com/api/partners/pejuang-quran/list?page=${pageNum}&limit=${limitNum}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data && res.data.success && res.data.data && Array.isArray(res.data.data.data)) {
        setData(res.data.data.data);
        setTotalPages(res.data.data.pagination.totalPages || 1);
        setTotal(res.data.data.pagination.total || 0);
      } else {
        setData([]);
        setTotalPages(1);
        setTotal(0);
      }
    } catch (err) {
      setError('Gagal memuat data');
      setData([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasAccess) {
      fetchData(page, limit);
    }
    // eslint-disable-next-line
  }, [page, limit, hasAccess]);

  if (checkingAccess) {
    return <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow text-center">Cek akses Pejuang Quran...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow text-center">
        <h1 className="text-xl font-bold mb-4">Kehadiran Pejuang Quran</h1>
        <p className="mb-4 text-gray-700">Anda belum terdaftar di event Pejuang Quran.<br/>Jika sudah pernah request silakan menunggu admin, jika belum silakan klik tombol request di bawah ini.</p>
        {requestMessage && <div className="mb-4 text-green-700 font-semibold">{requestMessage}</div>}
        <button
          onClick={handleRequest}
          disabled={requesting}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {requesting ? 'Mengirim request...' : 'Request Akses Pejuang Quran'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Kehadiran Pejuang Quran</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Peserta</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Surat</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satgas</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ayat</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Juz</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Peserta</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-center py-8 text-red-500">{error}</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8">Tidak ada data</td></tr>
            ) : data.map((row: any) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{row.peserta_nama}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.surat_nama}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.petugas_nama}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.ayat}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.juz_nama || `Juz ${row.juz_number}`}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.tanggal ? new Date(row.tanggal).toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }) : '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap">{row.id_peserta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>Halaman {page} dari {totalPages} (Total: {total})</span>
        <div className="space-x-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Sebelumnya</button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Berikutnya</button>
        </div>
      </div>
    </div>
  );
};

export default KehadiranPejuangQuran; 