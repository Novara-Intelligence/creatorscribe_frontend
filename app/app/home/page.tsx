import { Moon02Icon } from "hugeicons-react";
import { Moon, ChevronRight, Mic, Headphones, ImagePlay, Bot, Music, Disc, Video, Languages } from "lucide-react";

const ACTION_ITEMS = [
  { label: "Instant speech", icon: Mic },
  { label: "Audiobook", icon: Headphones },
  { label: "Image & Video", icon: ImagePlay },
  { label: "ElevenAgents", icon: Bot },
  { label: "Music", icon: Music },
  { label: "Dubbed video", icon: Languages },
];

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 p-1 group-data-[collapsible=icon]:px-22 group-data-[collapsible=icon]:py-18 h-full">
      <header className="flex items-center justify-between w-full">
        <button className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
          <span className="bg-[#24292f] text-white text-xs font-medium px-2 py-1 rounded-full">
            New
          </span>
          <span className="text-sm font-medium tracking-tight">Caption Generator</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 stroke-[2.5]" />
        </button>

        <button className="hover:text-black transition-colors">
          {/* <Moon className="w-5 h-5 fill-current" /> */}
          <Moon02Icon size={18} />
        </button>
      </header>

      <main className="flex flex-col mt-8">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-400 tracking-wide">My Workspace</span>
          <h1 className="text-2xl font-bold tracking-tight">
            Good afternoon, Dhinesh
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {ACTION_ITEMS.map((item) => (
            <button key={item.label} className="group flex flex-col items-center gap-3">
              <div className="w-full aspect-square bg-muted rounded-3xl flex items-center justify-center cursor-pointer">
                <item.icon className="w-10 h-10 text-gray-600" />
              </div>
              <span className="text-[13px] font-semibold text-gray-700 tracking-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
