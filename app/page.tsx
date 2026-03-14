import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-raleway)]">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-sm">
        <div className="!mx-auto flex h-16 max-w-(--page-max-width) items-center px-6">
          {/* Logo + Title */}
          <div className="flex items-center gap-2.5">
            <Image src="/cs_icon.svg" alt="CreatorScribe" width={32} height={32} priority />
            <span className="!text-lg !font-semibold !tracking-tight !text-zinc-900">
              CreatorScribe
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-(--page-max-width) px-6 py-16">
        {/* SPA content goes here */}
      </main>
    </div>
  );
}
