import React, { useState } from 'react';
import { Search, Filter, Users, Phone, Calendar, Edit, Trash2, Eye } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  cardNumber: string;
  phone: string;
  gender: 'L' | 'P';
  birthDate: string;
  registeredAt: string;
  lastAttendance: string;
  totalAttendance: number;
}

const MemberList: React.FC = () => {
  const [members] = useState<Member[]>([
    {
      id: '1',
      name: 'Ahmad Fauzi',
      cardNumber: 'KRT-001234',
      phone: '08123456789',
      gender: 'L',
      birthDate: '1990-05-15',
      registeredAt: '2024-01-15',
      lastAttendance: '2024-01-25T05:30:00Z',
      totalAttendance: 45
    },
    {
      id: '2',
      name: 'Siti Rahmah',
      cardNumber: 'KRT-001235',
      phone: '08234567890',
      gender: 'P',
      birthDate: '1985-08-22',
      registeredAt: '2024-01-16',
      lastAttendance: '2024-01-24T12:15:00Z',
      totalAttendance: 38
    },
    {
      id: '3',
      name: 'Budi Wijaya',
      cardNumber: 'KRT-001236',
      phone: '08345678901',
      gender: 'L',
      birthDate: '1992-12-10',
      registeredAt: '2024-01-17',
      lastAttendance: '2024-01-25T15:45:00Z',
      totalAttendance: 52
    },
    {
      id: '4',
      name: 'Fatimah Zahra',
      cardNumber: 'KRT-001237',
      phone: '08456789012',
      gender: 'P',
      birthDate: '1988-03-25',
      registeredAt: '2024-01-18',
      lastAttendance: '2024-01-23T18:20:00Z',
      totalAttendance: 29
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'L' | 'P'>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    
    const matchesGender = genderFilter === 'all' || member.gender === genderFilter;
    
    return matchesSearch && matchesGender;
  });

  const handleViewDetail = (member: Member) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daftar Anggota</h1>
        <p className="text-gray-600 mt-1">Kelola data anggota masjid yang terdaftar</p>
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
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Laki-laki</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.gender === 'L').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Users className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Perempuan</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => m.gender === 'P').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
              <p className="text-2xl font-bold text-gray-900">
                {members.filter(m => 
                  new Date(m.registeredAt).getMonth() === new Date().getMonth()
                ).length}
              </p>
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
              placeholder="Cari nama, nomor kartu, atau nomor HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Daftar Anggota ({filteredMembers.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anggota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nomor Kartu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Kelamin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Umur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Absensi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absensi Terakhir
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        member.gender === 'L' ? 'bg-blue-100' : 'bg-pink-100'
                      }`}>
                        <Users className={`h-5 w-5 ${
                          member.gender === 'L' ? 'text-blue-600' : 'text-pink-600'
                        }`} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {member.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.cardNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateAge(member.birthDate)} tahun
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.totalAttendance} kali
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.lastAttendance).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetail(member)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <p className="text-sm text-gray-900">{selectedMember.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor Kartu</label>
                  <p className="text-sm text-gray-900">{selectedMember.cardNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor HP</label>
                  <p className="text-sm text-gray-900">{selectedMember.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                  <p className="text-sm text-gray-900">
                    {selectedMember.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedMember.birthDate).toLocaleDateString('id-ID')} 
                    ({calculateAge(selectedMember.birthDate)} tahun)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Daftar</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedMember.registeredAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Absensi</label>
                  <p className="text-sm text-gray-900">{selectedMember.totalAttendance} kali</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Absensi Terakhir</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedMember.lastAttendance).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Tutup
                </button>
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Edit Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;