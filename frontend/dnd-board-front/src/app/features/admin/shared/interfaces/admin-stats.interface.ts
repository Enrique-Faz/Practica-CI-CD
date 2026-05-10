export interface AdminStats {
  total_users: number;
  total_boards: number;
  chart_data: { date: string; total: number }[];
}

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  google2fa_enabled: boolean;
}

export interface AdminBoard {
  id: number;
  name: string;
  mapUrl: string;
  createdAt: string;
}
