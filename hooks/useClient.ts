"use client";

import useClientStore, { useActiveClient } from "@/store/clientStore";

export function useClient() {
  const clients = useClientStore((s) => s.clients);
  const activeClientId = useClientStore((s) => s.activeClientId);
  const isLoading = useClientStore((s) => s.isLoading);
  const error = useClientStore((s) => s.error);
  const fetchClients = useClientStore((s) => s.fetchClients);
  const setActiveClientId = useClientStore((s) => s.setActiveClientId);
  const activeClient = useActiveClient();

  return { clients, activeClientId, activeClient, isLoading, error, fetchClients, setActiveClientId };
}
