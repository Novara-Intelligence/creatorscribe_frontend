"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    return "";
  };

  const isSubmitDisabled = !email || !!validateEmail(email);

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-5">
      <div className="flex flex-col w-full max-w-[360px] gap-6">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-raleway text-2xl font-extrabold">Reset your password</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enter the email address associated with your account, and we&apos;ll send you a one-time code to reset your password.
          </p>
        </header>

        <form className="flex flex-col gap-4" onSubmit={(e) => {
          e.preventDefault();
          sessionStorage.setItem("otp_allowed", "1");
          router.push("/app/auth/verify-otp");
        }}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="field-reset-email"
              className={cn("text-sm font-semibold", emailError && "text-destructive")}
            >
              Email
            </label>
            <Input
              id="field-reset-email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(validateEmail(e.target.value));
              }}
              onBlur={(e) => setEmailError(validateEmail(e.target.value))}
              aria-invalid={!!emailError}
              className="h-11 rounded-xl text-sm font-medium font-montserrat"
            />
            {emailError && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive">
                <MdErrorOutline className="size-3.5 shrink-0" />
                {emailError}
              </p>
            )}
          </div>
          <Button type="submit" size="xl" className="w-full" disabled={isSubmitDisabled}>
            Send OTP
          </Button>
        </form>

        <button
          className="text-sm font-semibold underline cursor-pointer"
          onClick={() => router.push("/app/auth/sign-in")}
        >
          Return to Sign In
        </button>
        <div className="h-[200px]" />
      </div>
    </div>
  );
}
