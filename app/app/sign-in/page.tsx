"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, Separator, Field, Input } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";

export default function SignInPage() {
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const rules = [
    { label: "Minimum 8 characters", valid: password.length >= 8 },
    { label: "At least one number", valid: /\d/.test(password) },
    { label: "At least one special character", valid: /[^a-zA-Z0-9]/.test(password) },
  ];

  return (
    <div className="flex flex-col w-full max-w-[360px]">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <header className="flex flex-col items-center gap-2 !mb-8">
              <h1 className="font-raleway !text-2xl !font-extrabold transition-all duration-300">
                Welcome Back
              </h1>
            </header>

            <div className="flex flex-col gap-3 w-full">

              {/* Google button */}
              <Button variant="outline" className="!flex !justify-between !text-sm !font-semibold" size="xl" width="full" borderRadius="xl">
                <Image src="/icons/ic_google.svg" alt="Google" width={22} height={22} />
                <p>Sign in with Google</p>
                <div></div>
              </Button>

              {/* Facebook button */}
              <Button variant="outline" className="!flex !justify-between !text-sm !font-semibold" size="xl" width="full" borderRadius="xl">
                <Image src="/icons/ic_facebook.svg" alt="Facebook" width={22} height={22} />
                <p>Sign in with Facebook</p>
                <div></div>
              </Button>

              {/* Apple button — hidden on sign up */}
              <div
                style={{
                  overflow: "hidden",
                  maxHeight: "60px",
                  opacity: 1,
                  transition: "max-height 0.3s ease, opacity 0.3s ease",
                }}
              >
                <Button variant="outline" className="!flex !justify-between !text-sm !font-semibold" size="xl" width="full" borderRadius="xl">
                  <Image src="/icons/ic_apple.svg" alt="Apple" width={22} height={22} />
                  <p>Sign in with Apple</p>
                  <div></div>
                </Button>
              </div>
            </div>

            <Separator m={1} />

            <form className="flex flex-col gap-4 mt-2">
              <Field.Root>
                <Field.Label fontWeight="semibold">Email</Field.Label>
                <Input type="email" name="email" size="xl" fontSize="sm" fontWeight="medium" autoComplete="email" borderRadius="xl" fontFamily="var(--font-montserrat)" />
              </Field.Root>
              <Field.Root>
                <div className="flex items-center justify-between w-full">
                  <Field.Label fontWeight="semibold">Password</Field.Label>
                  {/* Forgot password — hidden on sign up */}
                  <div
                    style={{
                      overflow: "hidden",
                      maxWidth: "200px",
                      opacity: 1,
                      transition: "max-width 0.3s ease, opacity 0.3s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Link href="/app/forgot-password" className="!text-xs !font-semibold !text-gray-500 hover:underline underline-offset-2">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <PasswordInput
                  name="password"
                  size="xl"
                  fontSize="sm"
                  fontWeight="medium"
                  autoComplete="current-password"
                  borderRadius="xl"
                  fontFamily="var(--font-montserrat)"
                  onFocus={() => setPasswordTouched(true)}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Password rules — visible only on sign up */}
                <div
                  style={{
                    overflow: "hidden",
                    maxHeight: "0px",
                    opacity: 0,
                    transition: "max-height 0.3s ease, opacity 0.3s ease",
                  }}
                >
                  <ul className="flex flex-col gap-1 mt-2">
                    {rules.map((rule) => (
                      <li key={rule.label} className="flex items-center gap-2 !text-xs !font-semibold">
                        <span className={rule.valid ? "text-green-700" : "text-gray-400"}>
                          {rule.valid ? "✓" : "✗"}
                        </span>
                        <span className={rule.valid ? "text-green-700" : "text-gray-400"}>
                          {rule.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Field.Root>
              <Button type="submit" className="!my-1" size="xl" width="full" borderRadius="xl" colorPalette="black">
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

    </div>
  );
}

