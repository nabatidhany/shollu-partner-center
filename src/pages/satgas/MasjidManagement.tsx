import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Edit, Plus, Save, X } from 'lucide-react';

interface Masjid {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  capacity: number;
  facilities: string[];
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
}

const MasjidManagement: React.FC = () => {
  const [currentMasjid, setCurrentMasjid] = useState<Masjid | null>({
    id: '1',
    name: 'Masjid Al-Ikhlas',
    address: 'Jl. Raya Bogor No. 123',
    city: 'Bogor',
    province: 'Jawa Barat',
    phone: '0251-123456',
    email: 'info@masjidaliklas.com',
    capacity: 500,
    facilities: ['Parkir', 'AC', 'Sound System', 'Perpustakaan'],
    status: 'active',
    createdAt: '2024-01-15'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Masjid>>({});
  const [newMasjidForm, setNewMasjidForm] = useState<Partial<Masjid>>({
    name: '',
    address: '',
    city: '',
    province: '',
    phone: '',
    email: '',
    capacity: 0,
    facilities: []
  });

  const provinces = [
    'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten',
    'Yogyakarta', 'Sumatera Utara', 'Sumatera Barat', 'Sumatera Selatan',
    'Kalimantan Barat', 'Kalimantan Timur', 'Sulawesi Selatan', 'Bali'
  ];

  const availableFacilities = [
    'Parkir', 'AC', 'Sound System', 'Perpustakaan', 'Ruang Wudhu',
    'Toilet', 'Kantin', 'Aula', 'Tempat Sepatu', 'CCTV'
  ];

  const handleEditStart = () => {
    setEditForm(currentMasjid || {});
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (currentMasjid && editForm) {
      setCurrentMasjid({ ...currentMasjid, ...editForm });
      setIsEditing(false);
      setEditForm({});
      alert('Data masjid berhasil diperbarui dan menunggu persetujuan admin');
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleAddMasjid = (e: React.FormEvent) => {
    e.preventDefault();
    const newMasjid: Masjid = {
      id: Date.now().toString(),
      ...newMasjidForm as Masjid,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    alert('Request masjid baru berhasil dikirim dan menunggu persetujuan admin');
    setShowAddForm(false);
    setNewMasjidForm({
      name: '',
      address: '',
      city: '',
      province: '',
      phone: '',
      email: '',
      capacity: 0,
      facilities: []
    });
  };

  const handleFacilityToggle = (facility: string, isNewForm = false) => {
    if (isNewForm) {
      const currentFacilities = newMasjidForm.facilities || [];
      const updatedFacilities = currentFacilities.includes(facility)
        ? currentFacilities.filter(f => f !== facility)
        : [...currentFacilities, facility];
      setNewMasjidForm({ ...newMasjidForm, facilities: updatedFacilities });
    } else {
      const currentFacilities = editForm.facilities || currentMasjid?.facilities || [];
      const updatedFacilities = currentFacilities.includes(facility)
        ? currentFacilities.filter(f => f !== facility)
        : [...currentFacilities, facility];
      setEditForm({ ...editForm, facilities: updatedFacilities });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Masjid</h1>
          <p className="text-gray-600 mt-1">Kelola data masjid tempat Anda bertugas</p>
        </div>
        {!currentMasjid && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Masjid
          </button>
        )}
      </div>

      {/* Current Masjid */}
      {currentMasjid && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Data Masjid Saat Ini</h3>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  currentMasjid.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : currentMasjid.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentMasjid.status === 'active' ? 'Aktif' : 
                   currentMasjid.status === 'pending' ? 'Menunggu Persetujuan' : 'Nonaktif'}
                </span>
                {!isEditing ? (
                  <button
                    onClick={handleEditStart}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEditSave}
                      className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      <Save className="mr-1 h-4 w-4" />
                      Simpan
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <X className="mr-1 h-4 w-4" />
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Masjid</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name || currentMasjid.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentMasjid.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas Jamaah</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.capacity || currentMasjid.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentMasjid.capacity} orang</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                {isEditing ? (
                  <textarea
                    value={editForm.address || currentMasjid.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentMasjid.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kota</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.city || currentMasjid.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentMasjid.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provinsi</label>
                {isEditing ? (
                  <select
                    value={editForm.province || currentMasjid.province}
                    onChange={(e) => setEditForm({ ...editForm, province: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{currentMasjid.province}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone || currentMasjid.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentMasjid.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email || currentMasjid.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{currentMasjid.email}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fasilitas</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableFacilities.map(facility => (
                      <label key={facility} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(editForm.facilities || currentMasjid.facilities).includes(facility)}
                          onChange={() => handleFacilityToggle(facility)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{facility}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {currentMasjid.facilities.map(facility => (
                      <span key={facility} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {facility}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Masjid Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Masjid Baru</h3>
              <form onSubmit={handleAddMasjid} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Masjid *</label>
                    <input
                      type="text"
                      value={newMasjidForm.name}
                      onChange={(e) => setNewMasjidForm({ ...newMasjidForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas Jamaah *</label>
                    <input
                      type="number"
                      value={newMasjidForm.capacity}
                      onChange={(e) => setNewMasjidForm({ ...newMasjidForm, capacity: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat *</label>
                    <textarea
                      value={newMasjidForm.address}
                      onChange={(e) => setNewMasjidForm({ ...newMasjidForm, address: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kota *</label>
                    <input
                      type="text"
                      value={newMasjidForm.city}
                      onChange={(e) => setNewMasjidForm({ ...newMasjidForm, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provinsi *</label>
                    <select
                      value={newMasjidForm.province}
                      onChange={(e) => setNewMasjidForm({ ...newMasjidForm, province: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Pilih Provinsi</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                    <input
                      type="tel"
                      value={newMasjidForm.phone}
                      onChange={(e) => setNewMasjidForm({ ...newMasjidForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newMasjidForm.email}
                      onChange={(e) => setNewMasjidForm({ ...newMasjidForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fasilitas</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableFacilities.map(facility => (
                        <label key={facility} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(newMasjidForm.facilities || []).includes(facility)}
                            onChange={() => handleFacilityToggle(facility, true)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{facility}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Kirim Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* No Masjid State */}
      {!currentMasjid && !showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Belum Ada Masjid</h3>
            <p className="mt-2 text-gray-600">
              Anda belum ditugaskan di masjid manapun. Silakan ajukan request masjid baru.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="mr-2 h-5 w-5" />
              Tambah Masjid Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasjidManagement;