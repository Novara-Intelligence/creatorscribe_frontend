export interface UserProfile {
  profile_pic: string | null;
  email: string;
  full_name: string;
  current_plan: string;
  days_left: number | null;
  total_tokens: number | null;
  remaining_tokens: number | null;
}
