"use client";

import { Button, Field, Input } from "@chakra-ui/react";

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col w-full max-w-[360px] gap-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-raleway !text-2xl !font-extrabold">Reset your password</h1>
        <p className="!text-sm text-gray-500 !leading-relaxed">
          Enter the email address associated with your account, and we&apos;ll send you a link to reset your password.
        </p>
      </header>

      <form className="flex flex-col gap-4">
        <Field.Root id="field-reset-email">
          <Field.Label fontWeight="semibold">Email</Field.Label>
          <Input
            type="email"
            name="email"
            size="xl"
            fontSize="sm"
            fontWeight="medium"
            autoComplete="email"
            borderRadius="xl"
            fontFamily="var(--font-montserrat)"
          />
        </Field.Root>
        <Button type="submit" size="xl" width="full" borderRadius="xl" colorPalette="black">
          Send reset link
        </Button>
      </form>
    </div>
  );
}
