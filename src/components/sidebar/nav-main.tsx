"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isUrlActive = (url: string) => {
    if (url === "#") return false;
    return pathname === url || pathname.startsWith(url + "/");
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasActiveSubItem = item.items?.some((subItem) =>
            isUrlActive(subItem.url)
          );

          const isParentActive = isUrlActive(item.url) && !hasActiveSubItem;
          const shouldExpand = isParentActive || hasActiveSubItem;

          return item.items?.length !== 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={shouldExpand}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    size="lg"
                    className="space-x-2 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:!p-3.5"
                    isActive={isParentActive}
                  >
                    {item.icon && <item.icon className="h-5! w-5!" />}
                    {item.title}
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className="h-10"
                          isActive={isUrlActive(subItem.url)}
                          onClick={() => router.push(subItem.url)}
                        >
                          <span className="select-none">{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuButton
              key={item.title}
              tooltip={item.title}
              size="lg"
              className="space-x-2 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!w-12 group-data-[collapsible=icon]:!p-3.5"
              isActive={isParentActive}
              onClick={() => router.push(item.url)}
            >
              {item.icon && <item.icon className="h-5! w-5!" />}
              {item.title}
              <ChevronRight className={`hidden`} />
            </SidebarMenuButton>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
