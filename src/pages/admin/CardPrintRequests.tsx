import React, { useState } from 'react';
import { FileText, Download, Clock, CheckCircle, Truck, Eye, Printer } from 'lucide-react';

interface CardPrintRequest {
  id: string;
  satgasId: string;
  satgasName: string;
  satgasEmail: string;
  masjidName: string;
  quantity: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'printing' | 'shipped' | 'completed';
  notes?: string;
  estimatedDelivery?: string;
}

const CardPrintRequests: React.FC = () => {
  const [requests, setRequests] = useState<CardPrintRequest[]>([
    {
      id: '1',
      satgasId: '2',
      satgasName: 'Ahmad Wijaya',
      satgasEmail: 'ahmad.wijaya@email.com',
      masjidName: 'Masjid Al-Ikhlas',
      quantity: 50,
      requestDate: '2024-01-22',
      status: 'pending',
      notes: 'Request kartu untuk anggota baru'
    },
    {
      id: '2',
      satgasId: '3',
      satgasName: 'Siti Rahmah',
      satgasEmail: 'siti.rahmah@email.com',
      masjidName: 'Masjid An-Nur',
      quantity: 25,
      requestDate: '2024-01-20',
      status: 'approved',
      notes: 'Kartu tambahan untuk jamaah baru'
    },
    {
      id: '3',
      satgasId: '4',
      satgasName: 'Budi Santoso',
      satgasEmail: 'budi.santoso@email.com',
      masjidName: 'Masjid At-Taqwa',
      quantity: 75,
      requestDate: '2024-01-18',
      status: 'printing',
      notes: 'Request kartu untuk program dakwah',
      estimatedDelivery: '2024-01-28'
    },
    {
      id: '4',
      satgasId: '5',
      satgasName: 'Fatimah Zahra',
      satgasEmail: 'fatimah.zahra@email.com',
      masjidName: 'Masjid Ar-Rahman',
      quantity: 30,
      requestDate: '2024-01-15',
      status: 'shipped',
      notes: 'Kartu untuk anggota pengajian',
      estimatedDelivery: '2024-01-25'
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<CardPrintRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'printing' | 'shipped' | 'completed'>('all');

  const filteredRequests = requests.filter(request => 
    filterStatus === 'all' || request.status === filterStatus
  );

  const handleStatusChange = (requestId: string, newStatus: CardPrintRequest['status']) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedReq = { ...req, status: newStatus };
        if (newStatus === 'printing' || newStatus === 'shipped') {
          updatedReq.estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        }
        return updatedReq;
      }
      return req;
    }));
    
    const statusText = {
      approved: 'disetujui',
      printing: 'diproses cetak',
      shipped: 'dikirim',
      completed: 'selesai'
    };
    
    alert(`Request berhasil diubah ke status ${statusText[newStatus]}`);
  };

  const handleGeneratePDF = (request: CardPrintRequest) => {
    alert(`Generating PDF untuk ${request.quantity} kartu - ${request.masjidName}`);
  };

  const handleViewDetail = (request: CardPrintRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
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

  const getNextStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return [{ value: 'approved', label: 'Setujui', color: 'bg-green-600' }];
      case 'approved':
        return [{ value: 'printing', label: 'Mulai Cetak', color: 'bg-blue-600' }];
      case 'printing':
        return [{ value: 'shipped', label: 'Kirim', color: 'bg-purple-600' }];
      case 'shipped':
        return [{ value: 'completed', label: 'Selesai', color: 'bg-green-600' }];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Request Cetak Kartu</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Kelola permintaan cetak kartu dari satgas</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs md:text-sm font-medium text-gray-600">Pending</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs md:text-sm font-medium text-gray-600">Disetujui</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Printer className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs md:text-sm font-medium text-gray-600">Cetak</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'printing').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs md:text-sm font-medium text-gray-600">Dikirim</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'shipped').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-xs md:text-sm font-medium text-gray-600">Total</p>
              <p className="text-lg md:text-xl font-bold text-gray-900">{requests.length}</p>
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
            <option value="printing">Proses Cetak</option>
            <option value="shipped">Dikirim</option>
            <option value="completed">Selesai</option>
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
                  Satgas & Masjid
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
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.satgasName}</div>
                      <div className="text-sm text-gray-500">{request.masjidName}</div>
                      <div className="text-sm text-gray-500">{request.satgasEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.quantity} kartu</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.requestDate).toLocaleDateString('id-ID')}
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
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {(request.status === 'approved' || request.status === 'printing') && (
                        <button
                          onClick={() => handleGeneratePDF(request)}
                          className="text-green-600 hover:text-green-900"
                          title="Generate PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      {getNextStatusOptions(request.status).map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(request.id, option.value as any)}
                          className={`px-2 py-1 text-xs font-medium text-white rounded ${option.color} hover:opacity-80`}
                        >
                          {option.label}
                        </button>
                      ))}
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
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{request.satgasName}</div>
                  <div className="text-xs text-gray-500">{request.masjidName}</div>
                  <div className="text-xs text-gray-500">{request.satgasEmail}</div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  <span className="ml-1">{getStatusText(request.status)}</span>
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">
                  <span className="font-medium">{request.quantity} kartu</span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(request.requestDate).toLocaleDateString('id-ID')}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleViewDetail(request)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                  title="Lihat Detail"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <div className="flex items-center space-x-2">
                  {(request.status === 'approved' || request.status === 'printing') && (
                    <button
                      onClick={() => handleGeneratePDF(request)}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Generate PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                  {getNextStatusOptions(request.status).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(request.id, option.value as any)}
                      className={`px-2 py-1 text-xs font-medium text-white rounded ${option.color} hover:opacity-80`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-10 mx-auto border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Request Cetak Kartu</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Satgas</label>
                  <p className="text-sm text-gray-900">{selectedRequest.satgasName}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.satgasEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Masjid</label>
                  <p className="text-sm text-gray-900">{selectedRequest.masjidName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jumlah Kartu</label>
                  <p className="text-sm text-gray-900">{selectedRequest.quantity} kartu</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Request</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedRequest.requestDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                {selectedRequest.estimatedDelivery && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimasi Pengiriman</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedRequest.estimatedDelivery).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                )}
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
                {(selectedRequest.status === 'approved' || selectedRequest.status === 'printing') && (
                  <button
                    onClick={() => {
                      handleGeneratePDF(selectedRequest);
                      setShowDetailModal(false);
                    }}
                    className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Generate PDF
                  </button>
                )}
                {getNextStatusOptions(selectedRequest.status).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, option.value as any);
                      setShowDetailModal(false);
                    }}
                    className={`w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${option.color} hover:opacity-80`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPrintRequests;