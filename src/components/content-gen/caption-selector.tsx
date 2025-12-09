"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight } from "lucide-react";
import { CaptionsIcon } from "lucide-react";

interface CaptionSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CAPTION_LENGTHS = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

export function CaptionSelector({ value, onValueChange }: CaptionSelectorProps) {
  const selectedCaption = CAPTION_LENGTHS.find(caption => caption.value === value);
  const displayText = selectedCaption ? selectedCaption.label : "Caption length";
  
  const [isMdOrLarger, setIsMdOrLarger] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMdOrLarger(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="w-full space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="text-foreground bg-accent/50 hover:bg-accent cursor-pointer w-full justify-between rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0">
            <div className="flex items-center">
              <CaptionsIcon className="mr-2 h-4 w-4" /> {displayText}
            </div>
            <ChevronRight />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side={isMdOrLarger ? "right" : "bottom"}
          align="start"
          className="w-[--radix-dropdown-menu-trigger-width]"
        >
          {CAPTION_LENGTHS.map((caption) => (
            <DropdownMenuItem className="text-foreground" key={caption.value} onClick={() => onValueChange(caption.value)}>
              {caption.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
