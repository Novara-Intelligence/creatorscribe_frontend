import { ChevronRight, Mic, Headphones, ImagePlay, Bot, Music, Languages } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const ACTION_ITEMS = [
  { label: "Instant speech", icon: Mic },
  { label: "Audiobook", icon: Headphones },
  { label: "Image & Video", icon: ImagePlay },
  { label: "ElevenAgents", icon: Bot },
  { label: "Music", icon: Music },
  { label: "Dubbed video", icon: Languages },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const firstName = "there";

  return (
    <div className="flex flex-col flex-1 p-1 group-data-[collapsible=icon]:px-22 group-data-[collapsible=icon]:py-18 h-full">
      <header className="flex items-center justify-between w-full">
        <button className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800">
          <span className="bg-[#24292f] text-white text-xs font-medium px-2 py-1 rounded-full dark:bg-zinc-100 dark:text-zinc-900">
            New
          </span>
          <span className="text-sm font-medium tracking-tight">Caption Generator</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 stroke-[2.5]" />
        </button>

        <ThemeToggle />
      </header>

      <main className="flex flex-col mt-8">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-muted-foreground tracking-wide">My Workspace</span>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {ACTION_ITEMS.map((item) => (
            <button key={item.label} className="group flex flex-col items-center gap-3">
              <div className="w-full aspect-square bg-muted rounded-3xl flex items-center justify-center cursor-pointer">
                <item.icon className="w-10 h-10 text-muted-foreground" />
              </div>
              <span className="text-[13px] font-semibold text-foreground tracking-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
