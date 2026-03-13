"use client";

import { Button, Field, Input, Icon } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";

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
          <h1 className="font-raleway !text-2xl !font-extrabold">Reset your password</h1>
          <p className="!text-sm text-gray-500 !leading-relaxed">
            Enter the email address associated with your account, and we&apos;ll send you a one-time code to reset your password.
          </p>
        </header>

        <form className="flex flex-col gap-4" onSubmit={(e) => {
            e.preventDefault();
            sessionStorage.setItem("otp_allowed", "1");
            router.push("/app/auth/verify-otp");
          }}>
          <Field.Root id="field-reset-email" invalid={!!emailError}>
            <Field.Label fontWeight="semibold" color={emailError ? "red.500" : undefined}>Email</Field.Label>
            <Input
              type="email"
              name="email"
              size="xl"
              fontSize="sm"
              fontWeight="medium"
              autoComplete="email"
              borderRadius="xl"
              fontFamily="var(--font-montserrat)"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(validateEmail(e.target.value));
              }}
              onBlur={(e) => setEmailError(validateEmail(e.target.value))}
            />
            <Field.ErrorText fontSize="xs" fontWeight="semibold">
              <Icon as={MdErrorOutline} boxSize={3.5} />
              {emailError}
            </Field.ErrorText>
          </Field.Root>
          <Button type="submit" size="xl" width="full" borderRadius="xl" colorPalette="black" disabled={isSubmitDisabled}>
            Send OTP
          </Button>
        </form>
        <button
          className="!text-sm !font-semibold !underline cursor-pointer"
          onClick={() => router.push("/app/auth/sign-in")}
        >
          Return to Sign In
        </button>
        <div className="h-[200px]"></div>
      </div>
    </div>
  );
}
