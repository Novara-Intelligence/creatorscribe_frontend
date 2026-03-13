"use client";

import { useState } from "react";
import { Avatar, Box, Flex, Text, Menu, Portal } from "@chakra-ui/react";
import { LuChevronsUpDown, LuCheck, LuPlus } from "react-icons/lu";

const clients = [
  { id: "1", name: "Alice Johnson", email: "alice@acmecorp.com", avatar: "" },
  { id: "2", name: "Bob Martinez", email: "bob@globex.com", avatar: "" },
  { id: "3", name: "Carol White", email: "carol@initech.com", avatar: "" },
];

export default function WorkspaceSwitcher() {
  const [active, setActive] = useState(clients[0]);

  return (
    <Menu.Root positioning={{ placement: "bottom", offset: { mainAxis: 6 } }}>
      <Menu.Trigger asChild>
        <Flex
          mx={3}
          px={1}
          py={1}
          borderRadius="lg"
          borderWidth="1px"
          align="center"
          gap={2}
          cursor="pointer"
          _hover={{ bg: "bg.muted" }}
          transition="background 0.15s"
        >
          <Avatar.Root size="xs" borderWidth="2px" borderColor="gray.300" borderRadius="full">
            <Avatar.Fallback>{active.name.charAt(0)}</Avatar.Fallback>
            {active.avatar && <Avatar.Image src={active.avatar} />}
          </Avatar.Root>

          <Text fontSize="sm" fontWeight="semibold" flex="1" truncate>
            {active.name}
          </Text>

          <Box color="gray.400" pr={1}>
            <LuChevronsUpDown size={14} />
          </Box>
        </Flex>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content minWidth="15rem" borderRadius="xl" p={1}>
            <Menu.ItemGroup>
            <Menu.ItemGroupLabel fontSize="xs" color="gray.400" px={2} pb={1}>
              Clients
            </Menu.ItemGroupLabel>

            {clients.map((client, index) => (
              <Box key={client.id}>
                <Menu.Item
                  value={client.id}
                  onClick={() => setActive(client)}
                  borderRadius="lg"
                >
                  <Flex align="center" gap={3} flex="1" py={0.5}>
                    <Avatar.Root size="sm" borderWidth="2px" borderColor="gray.300" borderRadius="full" flexShrink={0}>
                      <Avatar.Fallback fontSize="xs">{client.name.charAt(0)}</Avatar.Fallback>
                      {client.avatar && <Avatar.Image src={client.avatar} />}
                    </Avatar.Root>

                    <Flex direction="column" flex="1" gap={0} overflow="hidden">
                      <Text fontSize="sm" fontWeight="semibold" truncate>{client.name}</Text>
                      <Text fontSize="xs" color="gray.500" truncate>{client.email}</Text>
                    </Flex>

                    {active.id === client.id && (
                      <Box color="gray.500" flexShrink={0}>
                        <LuCheck size={14} />
                      </Box>
                    )}
                  </Flex>
                </Menu.Item>
                {index < clients.length - 1 && <Menu.Separator />}
              </Box>
            ))}
            </Menu.ItemGroup>

            <Menu.Separator />

            <Menu.Item value="new" borderRadius="lg" fontSize="sm" fontWeight="medium">
              <Flex align="center" gap={2}>
                <LuPlus size={14} />
                <Text>Add client</Text>
              </Flex>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
