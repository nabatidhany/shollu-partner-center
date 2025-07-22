import React, { useState } from 'react';
import { Printer, Download, CheckSquare, Square, Search, Filter } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  cardNumber: string;
  phone: string;
  gender: 'L' | 'P';
  birthDate: string;
  registeredAt: string;
  cardPrinted: boolean;
}

const PrintCards: React.FC = () => {
  const [members] = useState<Member[]>([
    {
      id: '1',
      name: 'Ahmad Fauzi',
      cardNumber: 'KRT-001234',
      phone: '08123456789',
      gender: 'L',
      birthDate: '1990-05-15',
      registeredAt: '2024-01-15',
      cardPrinted: true
    },
    {
      id: '2',
      name: 'Siti Rahmah',
      cardNumber: 'KRT-001235',
      phone: '08234567890',
      gender: 'P',
      birthDate: '1985-08-22',
      registeredAt: '2024-01-16',
      cardPrinted: false
    },
    {
      id: '3',
      name: 'Budi Wijaya',
      cardNumber: 'KRT-001236',
      phone: '08345678901',
      gender: 'L',
      birthDate: '1992-12-10',
      registeredAt: '2024-01-17',
      cardPrinted: false
    },
    {
      id: '4',
      name: 'Fatimah Zahra',
      cardNumber: 'KRT-001237',
      phone: '08456789012',
      gender: 'P',
      birthDate: '1988-03-25',
      registeredAt: '2024-01-18',
      cardPrinted: true
    },
  ]);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'printed' | 'not_printed'>('all');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.cardNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'printed' && member.cardPrinted) ||
                         (filterStatus === 'not_printed' && !member.cardPrinted);
    
    return matchesSearch && matchesFilter;
  });

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(member => member.id));
    }
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handlePrintSelected = () => {
    if (selectedMembers.length === 0) {
      alert('Pilih anggota yang akan dicetak kartunya');
      return;
    }
    
    const selectedNames = members
      .filter(member => selectedMembers.includes(member.id))
      .map(member => member.name)
      .join(', ');
    
    alert(`Mencetak kartu untuk: ${selectedNames}`);
    setSelectedMembers([]);
  };

  const handlePrintSingle = (member: Member) => {
    alert(`Mencetak kartu untuk: ${member.name}`);
  };

  const handleDownloadTemplate = () => {
    alert('Mengunduh template kartu...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cetak Kartu Anggota</h1>
          <p className="text-gray-600 mt-1">Kelola dan cetak kartu anggota masjid</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="mr-2 h-4 w-4" />
            Template
          </button>
          <button
            onClick={handlePrintSelected}
            disabled={selectedMembers.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="mr-2 h-4 w-4" />
            Cetak Terpilih ({selectedMembers.length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Cari anggota atau nomor kartu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="printed">Sudah Dicetak</option>
              <option value="not_printed">Belum Dicetak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Daftar Anggota</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedMembers.length === filteredMembers.length ? (
                  <CheckSquare className="h-4 w-4 mr-1" />
                ) : (
                  <Square className="h-4 w-4 mr-1" />
                )}
                Pilih Semua
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
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
                  Tanggal Daftar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status Cetak
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
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleSelectMember(member.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.cardNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.registeredAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.cardPrinted
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.cardPrinted ? 'Sudah Dicetak' : 'Belum Dicetak'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handlePrintSingle(member)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Cetak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Summary */}
      {selectedMembers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Printer className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                {selectedMembers.length} kartu dipilih untuk dicetak
              </span>
            </div>
            <button
              onClick={handlePrintSelected}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cetak Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintCards;