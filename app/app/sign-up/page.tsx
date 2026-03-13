"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button, Separator, Field, Input } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";

export default function SignUpPage() {
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
        <header className="flex flex-col items-center gap-2 !mb-8">
          <h1 className="font-raleway !text-2xl !font-extrabold">Create an account</h1>
        </header>

        <div className="flex flex-col gap-3 w-full">
          <Button variant="outline" className="!flex !justify-between !text-sm !font-semibold" size="xl" width="full" borderRadius="xl">
            <Image src="/icons/ic_google.svg" alt="Google" width={22} height={22} />
            <p>Sign up with Google</p>
            <div></div>
          </Button>
          <Button variant="outline" className="!flex !justify-between !text-sm !font-semibold" size="xl" width="full" borderRadius="xl">
            <Image src="/icons/ic_facebook.svg" alt="Facebook" width={22} height={22} />
            <p>Sign up with Facebook</p>
            <div></div>
          </Button>
        </div>

        <Separator m={1} />

        <form className="flex flex-col gap-4 mt-2">
          <Field.Root>
            <Field.Label fontWeight="semibold">Email</Field.Label>
            <Input type="email" name="email" size="xl" fontSize="sm" fontWeight="medium" autoComplete="email" borderRadius="xl" fontFamily="var(--font-montserrat)" />
          </Field.Root>
          <Field.Root>
            <Field.Label fontWeight="semibold">Password</Field.Label>
            <PasswordInput
              name="password"
              size="xl"
              fontSize="sm"
              fontWeight="medium"
              autoComplete="new-password"
              borderRadius="xl"
              fontFamily="var(--font-montserrat)"
              onFocus={() => setPasswordTouched(true)}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              style={{
                overflow: "hidden",
                maxHeight: passwordTouched ? `${rules.length * 28}px` : "0px",
                opacity: passwordTouched ? 1 : 0,
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
            Sign up
          </Button>
          <p className="!text-sm !text-center">
            Already have an account?{" "}
            <Link href="/app/sign-in" className="!font-semibold !text-black !underline decoration-gray-300 underline-offset-2">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
