"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { MdErrorOutline } from "react-icons/md";
import { APP_CONFIG } from "@/constants/config";
import { APP_ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isResetFlow = searchParams.get("source") === "reset";

  const { verifyOtp, resendOtp, isLoading, error } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(59);
  const refs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...digits];
    pasted.split("").forEach((char, i) => (next[i] = char));
    setDigits(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = Cookies.get(APP_CONFIG.otpPendingCookieName) ?? "";
    const otp = digits.join("");
    try {
      if (isResetFlow) {
        Cookies.set(APP_CONFIG.resetOtpCookieName, otp, { sameSite: "lax" });
        router.push(APP_ROUTES.AUTH.NEW_PASSWORD);
      } else {
        await verifyOtp({ email, otp_code: otp });
        router.push(APP_ROUTES.APP.HOME);
      }
    } catch {
      // error shown from store
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-5">
      <div className="flex flex-col w-full max-w-[360px] gap-6">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-raleway text-2xl font-extrabold">Verify your email</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isResetFlow
              ? "Enter the code we sent to your email to continue resetting your password."
              : "We sent a 6-digit code to your email address. Enter it below to continue."}
          </p>
        </header>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex gap-2 justify-center">
            {digits.map((digit, i) => (
              <Input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                maxLength={1}
                inputMode="numeric"
                className="h-12 w-12 rounded-xl text-center text-lg font-bold font-montserrat"
              />
            ))}
          </div>

          {error && (
            <Alert variant="destructive">
              <MdErrorOutline className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="font-montserrat text-center text-sm text-muted-foreground">
            {seconds > 0 ? (
              <span>Resend code in 0:{String(seconds).padStart(2, "0")}</span>
            ) : (
              <button
                type="button"
                className="text-sm font-semibold underline cursor-pointer text-primary disabled:opacity-50"
                disabled={isLoading}
                onClick={async () => {
                  const email = Cookies.get(APP_CONFIG.otpPendingCookieName) ?? "";
                  try {
                    await resendOtp({
                      email,
                      otp_type: isResetFlow ? "password_reset" : "registration",
                    });
                    setSeconds(59);
                  } catch {
                    // error shown from store
                  }
                }}
              >
                Resend code
              </button>
            )}
          </div>

          <Button type="submit" size="xl" className="w-full" disabled={digits.some((d) => !d) || isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Verifying…
              </span>
            ) : "Verify"}
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
