"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignUp = pathname === "/app/sign-up";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Logo — stays mounted across sign-in / sign-up */}
      <div className="flex justify-center gap-3 !py-14">
        <Image src="/cs_icon.svg" alt="CreatorScribe" width={24} height={24} />
        <p className="font-raleway !text-lg !font-extrabold">CreatorScribe</p>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 p-5">
        {children}
      </div>

      {/* Footer — only visible on sign-up */}
      <footer
        className={`w-full !py-6 !px-8 text-center !text-sm !font-semibold text-gray-500 bg-gray-50 transition-all duration-300 ${
          isSignUp ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        By continuing, you agree to our{" "}
        <Link href="/terms" className="!underline decoration-gray-300 hover:text-gray-600">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="!underline decoration-gray-300 hover:text-gray-600">
          Privacy Policy
        </Link>
        .
      </footer>
    </div>
  );
}
