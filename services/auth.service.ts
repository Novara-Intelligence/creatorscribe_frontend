import axiosInstance from "@/lib/axios";
import type { LoginPayload, RegisterPayload, ResetPasswordPayload, VerifyOtpPayload, VerifyOtpResponse, VerifyResetOtpPayload, VerifyResetOtpResponse } from "@/types/user";

const authService = {
  async login(payload: LoginPayload): Promise<VerifyOtpResponse> {
    const { data } = await axiosInstance.post<VerifyOtpResponse>("auth/signin", payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.post<{ success: boolean; message: string }>("auth/register", payload);
    return data;
  },

  async logout(payload: { refresh_token: string }): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.post<{ success: boolean; message: string }>("auth/logout", payload);
    return data;
  },

  async resendOtp(payload: { email: string; otp_type: "registration" | "password_reset" }): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.post<{ success: boolean; message: string }>("auth/request-otp", payload);
    return data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
    const { data } = await axiosInstance.post<{ success: boolean; message: string }>("auth/request-password-reset", payload);
    return data;
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    const { data } = await axiosInstance.post<VerifyOtpResponse>("auth/verify-registration", payload);
    return data;
  },

  async verifyResetOtp(payload: VerifyResetOtpPayload): Promise<VerifyResetOtpResponse> {
    const { data } = await axiosInstance.post<VerifyResetOtpResponse>("/auth/verify-password-reset", payload);
    return data;
  },
};

export default authService;
