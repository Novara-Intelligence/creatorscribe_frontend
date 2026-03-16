"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { MdErrorOutline } from "react-icons/md";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { APP_ROUTES } from "@/constants/routes";
import { APP_CONFIG } from "@/constants/config";

export default function NewPasswordPage() {
  const router = useRouter();
  const { verifyResetOtp, isLoading, error } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchError, setMatchError] = useState("");

  const isSubmitDisabled = isLoading || !newPassword || !confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMatchError("Passwords do not match.");
      return;
    }
    setMatchError("");
    const email = Cookies.get(APP_CONFIG.otpPendingCookieName) ?? "";
    const otp_code = Cookies.get(APP_CONFIG.resetOtpCookieName) ?? "";
    try {
      await verifyResetOtp({ email, otp_code, new_password: newPassword });
      router.push(APP_ROUTES.AUTH.SIGN_IN);
    } catch {
      // error shown from store
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-5">
      <div className="flex flex-col w-full max-w-[360px] gap-6">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-raleway text-2xl font-extrabold">Set new password</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enter a new password for your account.
          </p>
        </header>

        {(matchError || error) && (
          <Alert variant="destructive">
            <MdErrorOutline className="size-4" />
            <AlertDescription>{matchError || error}</AlertDescription>
          </Alert>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="field-new-password" className="text-sm font-semibold">
              New Password
            </label>
            <PasswordInput
              id="field-new-password"
              autoComplete="new-password"
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (matchError) setMatchError("");
              }}
              className="h-11 rounded-xl text-sm font-medium font-montserrat"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="field-confirm-password" className="text-sm font-semibold">
              Confirm Password
            </label>
            <PasswordInput
              id="field-confirm-password"
              autoComplete="new-password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (matchError) setMatchError("");
              }}
              className="h-11 rounded-xl text-sm font-medium font-montserrat"
            />
          </div>

          <Button type="submit" size="xl" className="mt-1 w-full" disabled={isSubmitDisabled}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Saving…
              </span>
            ) : "Set Password"}
          </Button>
        </form>

        <button
          className="text-sm font-semibold underline cursor-pointer"
          onClick={() => router.push(APP_ROUTES.AUTH.SIGN_IN)}
        >
          Return to Sign In
        </button>
        <div className="h-[200px]" />
      </div>
    </div>
  );
}
