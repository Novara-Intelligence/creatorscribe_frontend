"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

export default function Sidebar() {
  return (
    <Box
      width="16rem"
      minWidth="16rem"
      height="100%"
      bg="bg.subtle"
      borderRightWidth="1px"
      display="flex"
      flexDirection="column"
    >
      {/* Logo + Title */}
      <Flex align="center" gap={2} px={4} py={5}>
        <Image src="/cs_icon.svg" alt="CreatorScribe" width={28} height={28} />
        <Text fontFamily="var(--font-poppins)" fontWeight="semibold" fontSize="lg">
          CreatorScribe
        </Text>
      </Flex>

      {/* Workspace Switcher */}
      <WorkspaceSwitcher />

      {/* Sidebar content placeholder */}
      <Flex flex="1" align="center" justify="center">
        <Text fontWeight="semibold" color="gray.400">Sidebar</Text>
      </Flex>
    </Box>
  );
}
