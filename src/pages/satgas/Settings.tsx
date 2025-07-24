import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
const token = localStorage.getItem('shollu_token');
const fetchProfile = async () => {
  const res = await axios.get('https://app.shollu.com/api/partners/satgas/profile',{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const updateProfile = async (data: { name: string; password?: string }) => {
  const body: any = { name: data.name };
  if (data.password) body.password = data.password;
  const res = await axios.put('https://app.shollu.com/api/partners/satgas/profile/update-profile', body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const Settings: React.FC = () => {
  const { data, isLoading: isProfileLoading, refetch } = useQuery({
    queryKey: ['satgas-profile'],
    queryFn: fetchProfile,
  });
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    if (data?.data?.name) {
      setName(data.data.name)
    };
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      setPassword('');
      const userStr = localStorage.getItem('shollu_user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userObj.name = name;
          localStorage.setItem('shollu_user', JSON.stringify(userObj));
        } catch {}
      }
      refetch();
    },
    onError: (err: any) => {
      // Cek jika error response mengandung pesan validasi
      const data = err?.response?.data;
      let errorMsg = data?.message || 'Gagal memperbarui profil';
      // Cek error pada data.password._errors jika ada
      const passwordErr = data?.data?.password?._errors || data?.password?._errors;
      if (Array.isArray(passwordErr) && passwordErr.length > 0) {
        errorMsg = passwordErr[0];
      }
      setMessage({ type: 'error', text: errorMsg });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (password) {
      mutation.mutate({ name, password });
    } else {
      mutation.mutate({ name });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">Pengaturan Akun</h1>
      {message && (
        <div className={`mb-4 p-3 rounded text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nama baru"
            required
            disabled={isProfileLoading || mutation.isPending}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Password baru"
            disabled={mutation.isPending}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isProfileLoading || mutation.isPending}
        >
          {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
};

export default Settings; 