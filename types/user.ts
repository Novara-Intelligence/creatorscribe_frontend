export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp_code: string;
  new_password: string;
}

export interface VerifyResetOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp_code: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}
