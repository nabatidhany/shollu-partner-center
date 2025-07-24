import React, { useState, useEffect, useRef } from 'react';
import { getMasjidByEvent, registerSatgas } from '../../api/auth';
import { MasjidByEventItem } from '../../types';
import { Link } from 'react-router-dom';

const EVENT_OPTIONS = [
  { id: 3, label: 'Sholat Champions' },
];

const RegisterSatgas: React.FC = () => {
  const [eventId, setEventId] = useState(3);
  const [masjidList, setMasjidList] = useState<MasjidByEventItem[]>([]);
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    masjid_id: 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const errorAudioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    setMasjidList([]);
    setForm(f => ({ ...f, masjid_id: 0 }));
    getMasjidByEvent(eventId).then(res => {
      setMasjidList(res.data);
    });
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await registerSatgas({
        name: form.name,
        username: form.username,
        password: form.password,
        masjid_id: Number(form.masjid_id),
      });
      if (res.success) {
        setSuccess('Pendaftaran berhasil!');
        successAudioRef.current?.play();
        setForm({ name: '', username: '', password: '', masjid_id: 0 });
      } else {
        errorAudioRef.current?.play();
        setError(res.message || 'Gagal mendaftar');
      }
    } catch (err: any) {
      errorAudioRef.current?.play();
      setError(err?.response?.data?.message || 'Gagal mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <div className="flex justify-center mb-6">
        <img src="/logo.svg" alt="Logo" className="h-14 w-auto" />
      </div>
      {/* Audio Elements */}
      <audio ref={successAudioRef} src="/sound/success.wav" />
      <audio ref={errorAudioRef} src="/sound/error.wav" />
      <h1 className="text-2xl font-bold mb-6 text-center">Register Satgas</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
          <select
            value={eventId}
            onChange={e => setEventId(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            {EVENT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Masjid</label>
          <select
            name="masjid_id"
            value={form.masjid_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          >
            <option value={0}>Pilih Masjid</option>
            {masjidList.map((m: any) => (
              <option key={m.id} value={m.id_masjid}>{m.nama}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username (No HP)</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        {success && <div className="bg-green-100 text-green-700 p-2 rounded text-center">{success}</div>}
        {error && <div className="bg-red-100 text-red-700 p-2 rounded text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Mendaftar...' : 'Daftar Satgas'}
        </button>
      </form>
      <div className="text-center mt-4">
        <Link to="/login" className="text-blue-600 hover:underline text-sm">&larr; Kembali ke Login</Link>
      </div>
    </div>
  );
};

export default RegisterSatgas; 