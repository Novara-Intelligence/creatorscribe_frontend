"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";
import { APP_ROUTES } from "@/constants/routes";
import { APP_CONFIG } from "@/constants/config";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isSignUp = pathname === "/app/auth/sign-up";

  const { register, isLoading, error, clearError } = useAuth();

  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    setPassword("");
    setPasswordTouched(false);
    setEmail("");
    setEmailError("");
    clearError();
  }, [isSignUp, clearError]);

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
    return "";
  };

  const rules = [
    { label: "Minimum 8 characters", valid: password.length >= 8 },
    { label: "At least one number", valid: /\d/.test(password) },
    { label: "At least one special character", valid: /[^a-zA-Z0-9]/.test(password) },
  ];

  const passwordValid = rules.every((r) => r.valid);
  const isSubmitDisabled =
    isLoading || !email || !!validateEmail(email) || !password || (isSignUp ? !passwordValid : false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      try {
        await register({ email, password });
        Cookies.set(APP_CONFIG.otpPendingCookieName, "1", { sameSite: "lax" });
        router.push(APP_ROUTES.AUTH.VERIFY_OTP);
      } catch {
        // error shown from store
      }
    } else {
      // sign-in — TODO
      router.push(APP_ROUTES.APP.HOME);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center flex-1 p-5">
        <div className="flex flex-col w-full max-w-[360px] gap-4">

          {/* Title */}
          <header className="flex flex-col items-center mb-8">
            <h1 className="font-raleway text-2xl font-extrabold transition-all duration-300">
              {isSignUp ? "Create an account" : "Welcome Back"}
            </h1>
          </header>

          {/* Social buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Button variant="outline" size="xl" className="w-full justify-between">
              <Image src="/icons/ic_google.svg" alt="Google" width={22} height={22} />
              <p>{isSignUp ? "Sign up" : "Sign in"} with Google</p>
              <div />
            </Button>
            <Button variant="outline" size="xl" className="w-full justify-between">
              <Image src="/icons/ic_facebook.svg" alt="Facebook" width={22} height={22} />
              <p>{isSignUp ? "Sign up" : "Sign in"} with Facebook</p>
              <div />
            </Button>
            {/* Apple — hidden on sign up */}
            <div style={{
              overflow: "hidden",
              maxHeight: isSignUp ? "0px" : "60px",
              opacity: isSignUp ? 0 : 1,
              transition: "max-height 0.35s ease, opacity 0.35s ease",
            }}>
              <Button variant="outline" size="xl" className="w-full justify-between">
                <Image src="/icons/ic_apple.svg" alt="Apple" width={22} height={22} className="dark:invert" />
                <p>Sign in with Apple</p>
                <div />
              </Button>
            </div>
          </div>

          <Separator className="my-1" />

          {/* API error */}
          {error && (
            <Alert variant="destructive">
              <MdErrorOutline className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="field-email"
                className={cn("text-sm font-semibold", emailError && "text-red-500")}
              >
                Email
              </label>
              <Input
                id="field-email"
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

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between w-full">
                <label htmlFor="field-password" className="text-sm font-semibold">Password</label>
                <div style={{
                  overflow: "hidden",
                  maxWidth: isSignUp ? "0px" : "200px",
                  opacity: isSignUp ? 0 : 1,
                  whiteSpace: "nowrap",
                }}>
                  <Link href="/app/auth/reset-password" className="text-xs font-semibold text-muted-foreground hover:underline underline-offset-2">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <PasswordInput
                id="field-password"
                name="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                onFocus={() => setPasswordTouched(true)}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl text-sm font-medium font-montserrat"
              />
              {/* Password rules — sign up only */}
              <div style={{
                overflow: "hidden",
                maxHeight: isSignUp && passwordTouched ? `${rules.length * 28}px` : "0px",
                opacity: isSignUp && passwordTouched ? 1 : 0,
                transition: "max-height 0.35s ease, opacity 0.35s ease",
              }}>
                <ul className="flex flex-col gap-1 mt-2">
                  {rules.map((rule) => (
                    <li key={rule.label} className="flex items-center gap-2 text-xs font-semibold">
                      <span className={rule.valid ? "text-green-700" : "text-muted-foreground"}>{rule.valid ? "✓" : "✗"}</span>
                      <span className={rule.valid ? "text-green-700" : "text-muted-foreground"}>{rule.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button type="submit" size="xl" className="my-1 w-full" disabled={isSubmitDisabled}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  {isSignUp ? "Signing up…" : "Signing in…"}
                </span>
              ) : (
                isSignUp ? "Sign up" : "Sign in"
              )}
            </Button>

            <p className="text-sm text-center">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <Link
                href={isSignUp ? "/app/auth/sign-in" : "/app/auth/sign-up"}
                className="font-semibold underline underline-offset-2"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Footer — sign up only */}
      <footer className={`w-full py-6 px-8 text-center text-sm font-semibold text-muted-foreground bg-muted transition-all duration-300 ${isSignUp ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline decoration-muted-foreground hover:text-foreground">Terms of Service</Link>
        {" "}and{" "}
        <Link href="/privacy" className="underline decoration-muted-foreground hover:text-foreground">Privacy Policy</Link>.
      </footer>
    </>
  );
}
