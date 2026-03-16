"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/constants/routes";

const NAV_ITEMS = [
  { label: "Profile", href: APP_ROUTES.SETTINGS.PROFILE },
  { label: "Clients", href: APP_ROUTES.SETTINGS.CLIENTS },
  { label: "Settings", href: APP_ROUTES.SETTINGS.GENERAL },
];

export function SettingsNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 pb-3 border-b">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <div key={item.href} className="relative flex flex-col items-center gap-2">
            <Button
              variant={isActive ? "outline" : "ghost"}
              className={`font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}
              onClick={() => router.push(item.href)}
            >
              {item.label}
            </Button>
            {isActive && (
              <span className="absolute -bottom-3 left-0 w-full h-0.5 bg-foreground rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
}
