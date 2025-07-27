import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingSatgas, approveSatgas, rejectSatgas } from '../../api/auth';
import { SatgasPendingItem } from '../../types';
import { SatgasPendingApiResponse } from '../../types';

const EVENT_OPTIONS = [
  { id: 1, label: 'Pejuang Quran' },
  { id: 3, label: 'Sholat Champions' },
];

const SatgasRequests: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedRequest, setSelectedRequest] = useState<SatgasPendingItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveTarget, setApproveTarget] = useState<SatgasPendingItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState(3);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<SatgasPendingItem | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<SatgasPendingApiResponse>({
    queryKey: ['pending-satgas', page, limit],
    queryFn: () => getPendingSatgas(page, limit),
    // keepPreviousData: true, // Remove if not supported in your react-query version
  });

  const approveMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => approveSatgas(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-satgas'] }),
  });
  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectSatgas(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-satgas'] }),
  });

  const handleApprove = (id: number) => {
    const target = requests.find(r => r.id === id) || null;
    setApproveTarget(target);
  
    // ↓ Ini bagian yang harus benar
    if (target && (target as any).id_event) {
      const eventData = (target as any).id_event;
      if (Array.isArray(eventData)) {
        setSelectedEvent(Number(eventData[0]));
      } else if (typeof eventData === 'number') {
        setSelectedEvent(eventData);
      }
    } else {
      setSelectedEvent(3); // default fallback
    }
  
    setShowApproveModal(true);
  };
  
  const confirmApprove = () => {
    if (approveTarget) {
      // Don't send id_event to API since it's read-only and already set in registration
      approveMutation.mutate({ id: approveTarget.id });
      setShowApproveModal(false);
      setApproveTarget(null);
    }
  };
  const handleReject = (id: number) => {
    const target = requests.find(r => r.id === id) || null;
    setRejectTarget(target);
    setShowRejectModal(true);
  };
  const confirmReject = () => {
    if (rejectTarget) {
      rejectMutation.mutate(rejectTarget.id);
      setShowRejectModal(false);
      setRejectTarget(null);
    }
  };
  const handleViewDetail = (request: SatgasPendingItem) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const getEventLabels = (eventIds: number | number[]): string => {
    if (!eventIds) return 'Tidak ada event';
  
    const idsArray = Array.isArray(eventIds) ? eventIds : [eventIds];
  
    const labels = idsArray.map(id => {
      const event = EVENT_OPTIONS.find(opt => opt.id === Number(id));
      return event ? event.label : `Event ID: ${id}`;
    });
  
    return labels.join(', ');
  };
  
  

  // Stats
  const summary = data?.data?.summary;
  const requests: SatgasPendingItem[] = data?.data?.data || [];
  const currentPage = data?.data?.current_page || 1;
  const lastPage = data?.data?.last_page || 1;
  const total = data?.data?.total || 0;

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Request Satgas</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Kelola permohonan pendaftaran satgas baru</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Pending</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {summary?.pending || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Disetujui</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {summary?.approved || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-4 w-4 md:h-6 md:w-6 text-red-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Ditolak</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">
                {summary?.rejected || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Total</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{summary?.total || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table - Desktop */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masjid</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
              ) : isError ? (
                <tr><td colSpan={5} className="text-center py-8 text-red-500">Gagal memuat data</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8">Tidak ada data</td></tr>
              ) : requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{request.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{request.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{request.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{request.nama_masjid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleViewDetail(request)} className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => handleApprove(request.id)} className="text-green-600 hover:text-green-900"><CheckCircle className="h-4 w-4" /></button>
                      <button onClick={() => handleReject(request.id)} className="text-red-600 hover:text-red-900"><XCircle className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">Gagal memuat data</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">Tidak ada data</div>
          ) : requests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-gray-900">{request.nama}</div>
                  <div className="text-xs text-gray-500">{request.username}</div>
                  <div className="text-xs text-gray-500">{request.contact}</div>
                  <div className="text-xs text-gray-500">{request.nama_masjid}</div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {String((request as any).status || 'pending')}
                </span>
              </div>
              <div className="flex items-center justify-end mt-2 space-x-2">
                <button onClick={() => handleViewDetail(request)} className="text-blue-600 hover:text-blue-900 p-1"><Eye className="h-4 w-4" /></button>
                <button onClick={() => handleApprove(request.id)} className="text-green-600 hover:text-green-900 p-1"><CheckCircle className="h-4 w-4" /></button>
                <button onClick={() => handleReject(request.id)} className="text-red-600 hover:text-red-900 p-1"><XCircle className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t">
          <span>Halaman {currentPage} dari {lastPage} (Total: {total})</span>
          <div className="space-x-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Sebelumnya</button>
            <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={currentPage === lastPage} className="px-3 py-1 border rounded disabled:opacity-50">Berikutnya</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-10 mx-auto border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Request Satgas</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama</label>
                  <p className="text-sm text-gray-900">{selectedRequest.nama}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-sm text-gray-900">{selectedRequest.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kontak</label>
                  <p className="text-sm text-gray-900">{selectedRequest.contact}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Masjid</label>
                  <p className="text-sm text-gray-900">{selectedRequest.nama_masjid}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event</label>
                  <p className="text-sm text-gray-900">
                    {getEventLabels((selectedRequest as any).id_event || [])}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button onClick={() => setShowDetailModal(false)} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Tutup</button>
                <button onClick={() => { handleReject(selectedRequest.id); setShowDetailModal(false); }} className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">Tolak</button>
                <button onClick={() => { handleApprove(selectedRequest.id); setShowDetailModal(false); }} className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">Setujui</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && approveTarget && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-20 mx-auto border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Konfirmasi Approve</h3>
              <p className="mb-4">Apakah Anda yakin ingin menyetujui <b>{approveTarget.nama}</b>?</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                  value={selectedEvent}
                  disabled
                >
                  {EVENT_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Event dipilih berdasarkan data pendaftaran
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowApproveModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                <button onClick={confirmApprove} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">Setujui</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && rejectTarget && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-20 mx-auto border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Konfirmasi Tolak</h3>
              <p className="mb-4">Apakah Anda yakin ingin <b>menolak</b> <b>{rejectTarget.nama}</b>?</p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                <button onClick={confirmReject} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">Tolak</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SatgasRequests;