"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";

function VerifyOTPContent() {
  const [otp, setOtp] = useState("");

  return (
    <div className="mx-auto flex h-screen w-full">
      {/* Left Side - OTP Verification Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-8">
        <div className="w-full md:w-sm space-y-8">
          <div className="flex items-center gap-2">
            <Image
              src="/images/cs_icon.svg"
              alt="Logo"
              width={28}
              height={28}
            />
            <h2 className="text-xl font-bold text-primary">CreatorScribe</h2>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Verify your account</h2>
            <p className="text-sm">
              We&apos;ve sent a verification code to your email address.
            </p>
          </div>
          <form className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot
                    index={0}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                  <InputOTPSlot
                    index={1}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                  <InputOTPSlot
                    index={2}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                  <InputOTPSlot
                    index={3}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                  <InputOTPSlot
                    index={4}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                  <InputOTPSlot
                    index={5}
                    className="h-14 w-14 text-xl font-semibold rounded-md"
                  />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to your email
              </p>
            </div>
            <Button 
              type="submit"
              className="w-full py-6! mt-6 cursor-pointer"
            >
              Verify Code
            </Button>
          </form>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                className="text-primary hover:underline font-medium"
              >
                Resend Code
              </button>
            </p>
            <a
              href="/signin"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeftIcon className="size-4" />
              Back to sign in
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Primary Background */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-primary p-8">
        <div className="text-center space-y-6 max-w-md">
          <Image
            src="/images/auth_bg.png"
            alt="Logo"
            width={1000}
            height={1000}
          />
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">
              Connect with CreatorScribe
            </h1>
            <p className="text-sm text-primary-foreground/90">
              Connect with Creators and get your content created
            </p>
          </div>
          <div className="pt-4">
            <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
              <div className="h-px w-12 bg-primary-foreground/30"></div>
              <span className="text-sm">Secure & Reliable</span>
              <div className="h-px w-12 bg-primary-foreground/30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTP() {
  return <VerifyOTPContent />;
}
