import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Building2, Edit, Eye } from 'lucide-react';

interface MasjidEditRequest {
  id: string;
  masjidId: string;
  masjidName: string;
  satgasName: string;
  satgasEmail: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  notes?: string;
}

const MasjidEditRequests: React.FC = () => {
  const [requests, setRequests] = useState<MasjidEditRequest[]>([
    {
      id: '1',
      masjidId: '1',
      masjidName: 'Masjid Al-Ikhlas',
      satgasName: 'Ahmad Wijaya',
      satgasEmail: 'ahmad.wijaya@email.com',
      requestDate: '2024-01-23',
      status: 'pending',
      changes: [
        {
          field: 'Nomor Telepon',
          oldValue: '0251-123456',
          newValue: '0251-654321'
        },
        {
          field: 'Email',
          oldValue: 'info@masjidaliklas.com',
          newValue: 'admin@masjidaliklas.com'
        }
      ],
      notes: 'Update kontak masjid karena perubahan pengurus'
    },
    {
      id: '2',
      masjidId: '2',
      masjidName: 'Masjid An-Nur',
      satgasName: 'Siti Rahmah',
      satgasEmail: 'siti.rahmah@email.com',
      requestDate: '2024-01-21',
      status: 'pending',
      changes: [
        {
          field: 'Kapasitas',
          oldValue: '500 orang',
          newValue: '600 orang'
        },
        {
          field: 'Fasilitas',
          oldValue: 'Parkir, AC, Sound System, Perpustakaan',
          newValue: 'Parkir, AC, Sound System, Perpustakaan, Aula'
        }
      ],
      notes: 'Renovasi selesai, kapasitas bertambah dan ada fasilitas baru'
    },
    {
      id: '3',
      masjidId: '3',
      masjidName: 'Masjid At-Taqwa',
      satgasName: 'Budi Santoso',
      satgasEmail: 'budi.santoso@email.com',
      requestDate: '2024-01-19',
      status: 'approved',
      changes: [
        {
          field: 'Alamat',
          oldValue: 'Jl. Merdeka No. 123',
          newValue: 'Jl. Merdeka No. 123A (Gedung Baru)'
        }
      ],
      notes: 'Pindah ke gedung baru di sebelah lokasi lama'
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<MasjidEditRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredRequests = requests.filter(request => 
    filterStatus === 'all' || request.status === filterStatus
  );

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
    alert('Request edit masjid berhasil disetujui');
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    ));
    alert('Request edit masjid ditolak');
  };

  const handleViewDetail = (request: MasjidEditRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Disetujui';
      case 'rejected':
        return 'Ditolak';
      default:
        return 'Menunggu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Request Edit Masjid</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Kelola permohonan perubahan data masjid</p>
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
                {requests.filter(r => r.status === 'pending').length}
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
                {requests.filter(r => r.status === 'approved').length}
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
                {requests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Edit className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-gray-600">Total</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <h3 className="text-base md:text-lg font-medium text-gray-900">Daftar Request</h3>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Requests Table - Mobile Cards */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Masjid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satgas Pengaju
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Perubahan
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
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{request.masjidName}</div>
                        <div className="text-sm text-gray-500">ID: {request.masjidId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.satgasName}</div>
                    <div className="text-sm text-gray-500">{request.satgasEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {request.changes.length} perubahan
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{getStatusText(request.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetail(request)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredRequests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{request.masjidName}</div>
                    <div className="text-xs text-gray-500">ID: {request.masjidId}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {request.changes.length} perubahan
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  <span className="ml-1">{getStatusText(request.status)}</span>
                </span>
              </div>
              
              <div className="mt-3">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Pengaju:</span> {request.satgasName}
                </div>
                <div className="text-xs text-gray-500">{request.satgasEmail}</div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(request.requestDate).toLocaleDateString('id-ID')}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewDetail(request)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="text-green-600 hover:text-green-900 p-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-10 mx-auto border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Request Edit Masjid</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Masjid</label>
                    <p className="text-sm text-gray-900">{selectedRequest.masjidName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID Masjid</label>
                    <p className="text-sm text-gray-900">{selectedRequest.masjidId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Satgas Pengaju</label>
                    <p className="text-sm text-gray-900">{selectedRequest.satgasName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Satgas</label>
                    <p className="text-sm text-gray-900">{selectedRequest.satgasEmail}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Perubahan yang Diajukan</label>
                  <div className="space-y-3">
                    {selectedRequest.changes.map((change, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-900 mb-2">{change.field}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs text-gray-500">Nilai Lama:</span>
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{change.oldValue}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Nilai Baru:</span>
                            <p className="text-sm text-green-600 bg-green-50 p-2 rounded">{change.newValue}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Request</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedRequest.requestDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                
                {selectedRequest.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catatan</label>
                    <p className="text-sm text-gray-900">{selectedRequest.notes}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="ml-1">{getStatusText(selectedRequest.status)}</span>
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Tutup
                </button>
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleReject(selectedRequest.id);
                        setShowDetailModal(false);
                      }}
                      className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => {
                        handleApprove(selectedRequest.id);
                        setShowDetailModal(false);
                      }}
                      className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      Setujui
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasjidEditRequests;