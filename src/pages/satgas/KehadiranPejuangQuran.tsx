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
    fetchData(page, limit);
    // eslint-disable-next-line
  }, [page, limit]);

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
              <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="text-center py-8 text-red-500">{error}</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8">Tidak ada data</td></tr>
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