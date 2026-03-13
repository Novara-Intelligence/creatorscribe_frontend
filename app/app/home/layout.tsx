"use client";

import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./_components/Sidebar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex height="100vh">
      <Sidebar />

      {/* Content area */}
      <Box flex="1" height="100%" overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
}
