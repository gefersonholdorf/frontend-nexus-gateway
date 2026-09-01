import { useMemo } from "react";
import { useLoginExpired } from "@/contexts/login-expired";
import { useUser } from "@/contexts/user-context";
import { ApiClient } from "@/lib/api/api-client";

export function useApiClient(): ApiClient {
  const { user } = useUser();
  const { handleSetLoginExpired } = useLoginExpired();

  return useMemo(
    () =>
      new ApiClient({
        getToken: () => user?.token,
        onUnauthorized: () => handleSetLoginExpired(true),
      }),
    [user?.token, handleSetLoginExpired],
  );
}