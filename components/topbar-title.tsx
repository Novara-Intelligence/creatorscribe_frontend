"use client";

import { usePathname } from "next/navigation";

const routeNames: Record<string, string> = {
  "/app/home": "Home",
  "/app/home/analytics": "Analytics",
  "/app/home/content-calendar": "Content Calendar",
  "/app/home/addons": "Addons",
};

export function TopbarTitle() {
  const pathname = usePathname();
  const name = routeNames[pathname] ?? "Home";
  return (
    <span className="font-raleway text-sm font-semibold text-primary">{name}</span>
  );
}
