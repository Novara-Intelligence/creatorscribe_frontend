export interface Client {
  id: number;
  client_name: string;
  brand_logo: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: number;
  user_id: number;
  email: string;
  full_name: string;
  profile_pic: string | null;
  role: string;
  status: string;
  invited_by_email: string;
  created_at: string;
  updated_at: string;
}
