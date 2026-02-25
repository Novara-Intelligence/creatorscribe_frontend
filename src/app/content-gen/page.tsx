"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";

export default function ContentGen() {

  return (
    <AppLayout>
      <div className="min-h-screen text-black dark:text-white flex">
        {/* Main Content Area */}
        <div className="h-[calc(100vh-72px)] w-full md:w-sm border-r relative flex flex-col">
          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="space-y-4 pb-4">
              {/* File Upload Placeholder */}
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Upload Area</p>
              </div>
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="audioLanguage" className="text-muted-foreground text-xs">Audio Language</Label>
                  <p className="text-sm">English (US)</p>
                </div>

                <div className="space-y-0.5 mt-4">
                  <Label htmlFor="captionLength" className="text-muted-foreground text-xs mb-2">Content Settings</Label>
                  <p className="text-sm">Medium length captions</p>
                  <p className="text-sm">Medium description</p>
                  <p className="text-sm">Casual style</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Label htmlFor="hashtagCount" className="text-xs text-muted-foreground">Hashtag Count</Label>
                  <p className="text-sm">5</p>
                </div>
              </div>  
            </div>
          </div>
          
          {/* Fixed Bottom Section */}
          <div className="border-t p-4">
            <Textarea placeholder="Enter your prompt here" className="w-full h-20 resize-none"></Textarea>
            <Button className="mt-2 w-full mb-6" size="lg"><Sparkle className="mr-2 h-4 w-4" /> Generate</Button>
          </div>
        </div>

        {/* Job List */}
        <div className="flex-1 hidden md:block">
          <ScrollArea className="h-[calc(100vh-72px)]">
            <div className="space-y-6 pr-2 p-4">
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No jobs found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a file to get started
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </AppLayout>
  );
}
