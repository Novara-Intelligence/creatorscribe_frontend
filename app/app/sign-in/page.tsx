"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Separator, Field, Input } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
export default function SignInPage() {

  return (
    <div className="flex min-h-screen justify-center p-5">
      <div className="flex flex-col justify-between w-full max-w-[360px] !py-16">
        <div className="flex justify-center gap-3">
          <Image src="/cs_icon.svg" alt="CreatorScribe" width={24} height={24} />
          <p className="font-raleway !text-lg !font-bold">CreatorScribe</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Header */}
          <header className="flex flex-col items-center gap-2 !mb-10">
            <h1 className=" font-raleway !text-2xl !font-bold">
              Welcome Back
            </h1>
          </header>

          <div className="flex flex-col gap-3 w-full">
            <Button variant="outline" className="!flex !justify-between !text-sm !font-semibold" size="xl" width="full" borderRadius="xl">
              <GoogleIcon />
              <p>Sign in with Google</p>
              <div></div>
            </Button>
            <Button variant="outline" className="!flex !justify-between !text-sm !font-semibold"  size="xl" width="full" borderRadius="xl">
              <AppleIcon />
              <p>Sign in with Apple</p>
              <div></div>
            </Button>
          </div>

          <Separator m={2} />

          <form className="flex flex-col gap-4 mt-2">
            <Field.Root>
              <Field.Label fontWeight="semibold">Email</Field.Label>
              <Input type="email" name="email" size="xl" autoComplete="email" borderRadius="xl" />
            </Field.Root>
            <Field.Root>
              <div className="flex items-center justify-between w-full">
                <Field.Label fontWeight="semibold">Password</Field.Label>
                <Link href="/app/forgot-password" className="!text-xs !font-semibold !text-gray-500 hover:underline underline-offset-2">
                  Forgot your password?
                </Link>
              </div>
              <PasswordInput name="password" size="xl" autoComplete="current-password" borderRadius="xl" />
            </Field.Root>
            <Button type="submit" size="xl" width="full" borderRadius="xl" colorPalette="black">
              Sign in
            </Button>
            <p className="!text-sm !text-center">
              Don&apos;t have an account?{" "}
              <Link href="/app/sign-up" className="!font-semibold !text-black !underline decoration-gray-300 underline-offset-2">
                Sign up
              </Link>
            </p>
          </form>
        </div>

        <div></div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)">
        <path d="M24.2663 12.7764C24.2663 11.9607 24.2001 11.1406 24.059 10.3381H12.7402V14.9591H19.222C18.953 16.4494 18.0888 17.7678 16.8233 18.6056V21.6039H20.6903C22.9611 19.5139 24.2663 16.4274 24.2663 12.7764Z" fill="#4285F4" />
        <path d="M12.7401 24.5008C15.9766 24.5008 18.7059 23.4382 20.6945 21.6039L16.8276 18.6055C15.7517 19.3375 14.3627 19.752 12.7445 19.752C9.61388 19.752 6.95946 17.6399 6.00705 14.8003H2.0166V17.8912C4.05371 21.9434 8.2029 24.5008 12.7401 24.5008Z" fill="#34A853" />
        <path d="M6.00277 14.8003C5.50011 13.3099 5.50011 11.6961 6.00277 10.2057V7.11481H2.01674C0.314734 10.5056 0.314734 14.5004 2.01674 17.8912L6.00277 14.8003Z" fill="#FBBC04" />
        <path d="M12.7401 5.24966C14.4509 5.2232 16.1044 5.86697 17.3434 7.04867L20.7695 3.62262C18.6001 1.5855 15.7208 0.465534 12.7401 0.500809C8.2029 0.500809 4.05371 3.05822 2.0166 7.11481L6.00264 10.2058C6.95064 7.36173 9.60947 5.24966 12.7401 5.24966Z" fill="#EA4335" />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="24" height="24" fill="white" transform="translate(0.5 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="currentColor" />
    </svg>
  );
}
