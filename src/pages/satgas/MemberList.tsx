import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Phone, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMemberPesertaList } from '../../api/auth';
import { MemberPesertaItem, MemberPesertaApiResponse } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const EVENT_OPTIONS = [
  { id: 3, label: 'Sholat Champions' },
];

const MemberList: React.FC = () => {
  const { user } = useAuth();
  const [eventId, setEventId] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [selectedMember, setSelectedMember] = useState<MemberPesertaItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const isSatgas = user?.role === 'satgas';
  const satgas_id = isSatgas ? Number(user?.id) : undefined;

  const { data, isLoading, isError } = useQuery<MemberPesertaApiResponse>({
    queryKey: ['member-peserta', eventId, page, genderFilter, debouncedSearchTerm, satgas_id],
    queryFn: () => getMemberPesertaList({
      event_id: eventId,
      page,
      limit,
      satgas_id,
      gender: genderFilter !== 'all' ? genderFilter : undefined,
      search: debouncedSearchTerm || undefined,
    }),
  });

  let members: MemberPesertaItem[] = data?.data?.data || [];
  // Filter by search and gender (for stats only, API already filters for table)
  const filteredForStats = members;
  const summary = data?.data?.summary;

  const handleViewDetail = (member: MemberPesertaItem) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daftar Anggota</h1>
        <p className="text-gray-600 mt-1">Kelola data anggota masjid yang terdaftar</p>
      </div>

      {/* Event Dropdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Event</label>
        <select
          value={eventId}
          onChange={e => { setEventId(Number(e.target.value)); setPage(1); }}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {EVENT_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Anggota</p>
              <p className="text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
            </div>
          </div>
        </div>
        {/* Laki-laki */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Laki-laki</p>
              <p className="text-2xl font-bold text-gray-900">{summary?.total_male ?? 0}</p>
            </div>
          </div>
        </div>
        {/* Perempuan */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Users className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Perempuan</p>
              <p className="text-2xl font-bold text-gray-900">{summary?.total_female ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Cari nama, nomor HP, atau masjid..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value as any); setPage(1); }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Jenis Kelamin</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Daftar Anggota ({pagination?.total || 0})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor HP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kelamin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Umur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masjid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satgas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-8">Loading...</td></tr>
              ) : isError ? (
                <tr><td colSpan={8} className="text-center py-8 text-red-500">Gagal memuat data</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8">Tidak ada data</td></tr>
              ) : members.map((member) => (
                <tr key={member.peserta_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{member.fullname}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{calculateAge(member.dob)} tahun</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.nama_masjid}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.nama_satgas}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{member.qr_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleViewDetail(member)} className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                      <button className="text-green-600 hover:text-green-900"><Edit className="h-4 w-4" /></button>
                      <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t">
          <span>Halaman {pagination?.page || 1} dari {pagination?.totalPages || 1} (Total: {pagination?.total || 0})</span>
          <div className="space-x-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pagination?.page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Sebelumnya</button>
            <button onClick={() => setPage((p) => Math.min((pagination?.totalPages || 1), p + 1))} disabled={pagination?.page === pagination?.totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Berikutnya</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedMember && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Anggota</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <p className="text-sm text-gray-900">{selectedMember.fullname}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor HP</label>
                  <p className="text-sm text-gray-900">{selectedMember.contact}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                  <p className="text-sm text-gray-900">{selectedMember.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                  <p className="text-sm text-gray-900">{new Date(selectedMember.dob).toLocaleDateString('id-ID')} ({calculateAge(selectedMember.dob)} tahun)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Masjid</label>
                  <p className="text-sm text-gray-900">{selectedMember.nama_masjid}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Satgas</label>
                  <p className="text-sm text-gray-900">{selectedMember.nama_satgas}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">QR Code</label>
                  <p className="text-sm text-gray-900">{selectedMember.qr_code}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Tutup</button>
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Edit Data</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;