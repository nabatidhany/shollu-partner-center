import axios from 'axios';
import { LoginApiResponse } from '../types';
import { SatgasPendingApiResponse } from '../types';
import { MemberPesertaApiResponse } from '../types';
import { MasjidByEventApiResponse, RegisterSatgasApiResponse } from '../types';
import { RegisterPesertaRequest, RegisterPesertaApiResponse } from '../types';
import { AttendanceQrRequest, AttendanceQrApiResponse } from '../types';
import { StatistikAbsenSatgasResponse } from '../types';
import { CardRequestApiResponse, CardRequestListApiResponse, CardRequestStatusUpdate, CardRequestGeneratePDF } from '../types';

export async function loginPartner(email: string, password: string): Promise<LoginApiResponse> {
  const response = await axios.post<LoginApiResponse>(
    'https://app.shollu.com/auth/partners-login',
    {
      username: email,
      password,
    }
  );
  return response.data;
}

export async function getPendingSatgas(page: number, limit: number): Promise<SatgasPendingApiResponse> {
  const token = localStorage.getItem('shollu_token');
  const response = await axios.get<SatgasPendingApiResponse>(
    `https://app.shollu.com/api/partners/satgas/pending?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function approveSatgas(id: number, id_event: number): Promise<any> {
  const token = localStorage.getItem('shollu_token');
  const response = await axios.post(
    'https://app.shollu.com/api/partners/satgas/approve',
    { id, id_event },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function rejectSatgas(id: number): Promise<any> {
  const token = localStorage.getItem('shollu_token');
  const response = await axios.post(
    'https://app.shollu.com/api/partners/satgas/reject',
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getMemberPesertaList({ event_id, page, limit, satgas_id, gender, search }: { event_id: number; page: number; limit: number; satgas_id?: number; gender?: string; search?: string }): Promise<MemberPesertaApiResponse> {
  const token = localStorage.getItem('shollu_token');
  const params: any = { event_id, page, limit };
  if (satgas_id) params.satgas_id = satgas_id;
  if (gender) params.gender = gender;
  if (search) params.search = search;
  const response = await axios.get<MemberPesertaApiResponse>(
    'https://app.shollu.com/api/partners/satgas/get-peserta',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    }
  );
  return response.data;
}

export async function getMasjidByEvent(event_id: number): Promise<MasjidByEventApiResponse> {
  const response = await axios.get<MasjidByEventApiResponse>(
    `https://app.shollu.com/auth/masjid/by-event?id_event=${event_id}`
  );
  return response.data;
}

export async function registerSatgas(data: { name: string; username: string; password: string; masjid_id: number }): Promise<RegisterSatgasApiResponse> {
  const response = await axios.post<RegisterSatgasApiResponse>(
    'https://app.shollu.com/auth/partners-register',
    data
  );
  return response.data;
}

export async function registerPeserta(data: RegisterPesertaRequest): Promise<RegisterPesertaApiResponse> {
  const token = localStorage.getItem('shollu_token');
  const response = await axios.post<RegisterPesertaApiResponse>(
    'https://app.shollu.com/api/partners/satgas/register-peserta',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function submitAttendanceQr(data: AttendanceQrRequest): Promise<AttendanceQrApiResponse> {
  const response = await axios.post<AttendanceQrApiResponse>(
    'https://api.shollu.com/api/v1/absent-qr',
    data,
    {
      headers: {
        'X-API-Key': 'shollusemakindidepan',
      },
    }
  );
  return response.data;
}

export async function getStatistikAbsenSatgas(): Promise<StatistikAbsenSatgasResponse> {
  const token = localStorage.getItem('shollu_token');
  const response = await axios.get<StatistikAbsenSatgasResponse>(
    'https://app.shollu.com/api/partners/satgas/statistik-absen-satgas',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function requestCard(jumlah_kartu: number): Promise<CardRequestApiResponse> {
  const token = localStorage.getItem('shollu_token');
  const response = await axios.post<CardRequestApiResponse>(
    'https://app.shollu.com/api/partners/satgas/card/request',
    { jumlah_kartu },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getCardRequests(page: number = 1, limit: number = 10): Promise<CardRequestListApiResponse> {
  const token = localStorage.getItem('shollu_token');
  const response = await axios.get<CardRequestListApiResponse>(
    'https://app.shollu.com/api/partners/satgas/card/requests',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit },
    }
  );
  return response.data;
}

export async function updateCardRequestStatus(id: string, status: string): Promise<CardRequestApiResponse> {
  const token = localStorage.getItem('shollu_token');
  const response = await axios.put<CardRequestApiResponse>(
    `https://app.shollu.com/api/partners/satgas/card/requests/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function generateCardPDF(id_request: string): Promise<Blob> {
  const token = localStorage.getItem('shollu_token');
  const response = await axios.post(
    'https://app.shollu.com/api/partners/satgas/card/generate-by-request',
    { id_request },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    }
  );
  return response.data;
} 