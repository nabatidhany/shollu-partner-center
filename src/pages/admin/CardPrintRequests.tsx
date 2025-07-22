import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, CheckCircle, Truck, Eye, Printer } from 'lucide-react';
import { getCardRequests, updateCardRequestStatus } from '../../api/auth';

const CardPrintRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getCardRequests(page, limit);
      setRequests(res.data);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch {
      setRequests([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page]);

  const handleApprove = async (id: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await updateCardRequestStatus(id, 'disetujui');
      if (res.success) {
        setMessage('Request berhasil disetujui');
        fetchRequests();
      } else {
        setMessage(res.message || 'Gagal menyetujui request');
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Gagal menyetujui request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
      case 'disetujui':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'printing':
        return <Printer className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'approved':
      case 'disetujui':
        return 'Disetujui';
      case 'printing':
        return 'Proses Cetak';
      case 'shipped':
        return 'Dikirim';
      case 'completed':
        return 'Selesai';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'disetujui':
        return 'bg-green-100 text-green-800';
      case 'printing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Request Cetak Kartu</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Kelola permintaan cetak kartu dari satgas</p>
      </div>

      {message && (
        <div className="text-center p-3 rounded bg-green-100 text-green-700">{message}</div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Kartu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8">Belum ada request</td></tr>
              ) : requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.jumlah_kartu} kartu
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(request.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{getStatusText(request.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {request.status === 'request' && (
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => handleApprove(request.id)}
                        disabled={loading}
                      >
                        Setujui
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">Belum ada request</div>
          ) : requests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">{request.name}</div>
                  <div className="text-xs text-gray-500">{request.jumlah_kartu} kartu</div>
                  <div className="text-xs text-gray-500">{new Date(request.created_at).toLocaleDateString('id-ID')}</div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  <span className="ml-1">{getStatusText(request.status)}</span>
                </span>
              </div>
              <div className="flex items-center justify-end mt-2">
                {request.status === 'request' && (
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                    onClick={() => handleApprove(request.id)}
                    disabled={loading}
                  >
                    Setujui
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t">
          <span>Halaman {page} dari {totalPages} (Total: {total})</span>
          <div className="space-x-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Sebelumnya</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Berikutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPrintRequests;