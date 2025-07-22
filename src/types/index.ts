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