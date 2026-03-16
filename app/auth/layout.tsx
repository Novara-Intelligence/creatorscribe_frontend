"use client";

import Image from "next/image";

export default function AuthSharedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Logo — shared across all auth pages */}
      <div className="flex justify-center gap-3 !py-14">
        <Image src="/cs_icon.svg" alt="CreatorScribe" width={24} height={24} />
        <p className="font-poppins !text-lg !font-extrabold">CreatorScribe</p>
      </div>

      {/* Page content — children handle their own layout */}
      <div className="flex flex-col flex-1">
        {children}
      </div>

    </div>
  );
}
