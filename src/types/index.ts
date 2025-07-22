export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'satgas';
  masjidId?: string;
  createdAt: string;
}

export interface Satgas {
  id: string;
  name: string;
  email: string;
  phone: string;
  masjidId?: string;
  masjidName?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Masjid {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  satgasId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  gender: 'L' | 'P';
  birthDate: string;
  cardNumber: string;
  masjidId: string;
  registeredBy: string;
  createdAt: string;
}

export interface CardRequest {
  id: string;
  satgasId: string;
  satgasName: string;
  quantity: number;
  status: 'pending' | 'approved' | 'printed';
  createdAt: string;
}

export interface Attendance {
  id: string;
  memberId: string;
  memberName: string;
  masjidId: string;
  attendedAt: string;
  prayer: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
}

// Auth API response types
export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      name: string;
      role: string;
    };
  };
}

// Satgas Pending API types
export interface SatgasPendingItem {
  id: number;
  nama: string;
  contact: string;
  id_masjid: number;
  nama_masjid: string;
  id_user: number;
  username: string;
  name: string;
}

export interface SatgasSummary {
  pending: string;
  approved: string;
  rejected: string;
  total: number;
}

export interface SatgasPendingApiResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    data: SatgasPendingItem[];
    summary: SatgasSummary;
  };
}

export interface MemberPesertaItem {
  id_event: number;
  peserta_id: number;
  fullname: string;
  contact: string;
  gender: 'male' | 'female';
  dob: string;
  qr_code: string;
  status: number;
  IsHideName: number;
  masjid_id: number;
  nama_masjid: string;
  nama_satgas: string;
}

export interface MemberPesertaApiResponse {
  success: boolean;
  message: string;
  data: {
    data: MemberPesertaItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    summary?: {
      total_male: number;
      total_female: number;
    };
  };
}

export interface MasjidByEventItem {
  id: number;
  name: string;
}

export interface MasjidByEventApiResponse {
  success: boolean;
  message: string;
  data: MasjidByEventItem[];
}

export interface RegisterSatgasApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface RegisterPesertaRequest {
  fullname: string;
  contact: string;
  gender: 'male' | 'female';
  dob: string;
  qr_code: string;
  id_event: number;
  is_hide_name: boolean;
}

export interface RegisterPesertaApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface AttendanceQrRequest {
  qr_code: string;
  mesin_id: string;
  event_id: number;
}

export interface AttendanceQrApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  fullname?: string;
  tag?: string;
  qr_code?: string;
  event_id?: number;
  user_id?: number;
  [key: string]: any;
}

export interface StatistikAbsenSatgasResponse {
  success?: boolean;
  message?: string;
  data: {
    total_per_sholat: {
      subuh: number;
      dzuhur: number;
      ashar?: number;
      maghrib: number;
      isya: number;
      [key: string]: number | undefined;
    };
    latest_absensi: Array<{
      id: string | number;
      user_id?: number;
      fullname?: string;
      tag?: string;
      waktu?: string;
      [key: string]: any;
    }>;
  };
}