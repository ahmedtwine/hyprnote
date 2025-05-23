import { useQueries } from "@tanstack/react-query";
import { createContext, useContext } from "react";

import { commands as authCommands } from "@hypr/plugin-auth";
import { commands as dbCommands } from "@hypr/plugin-db";

export interface HyprContext {
  userId: string;
  onboardingSessionId: string;
}

const HyprContext = createContext<HyprContext | null>(null);

export function HyprProvider({ children }: { children: React.ReactNode }) {
  const [userId, onboardingSessionId] = useQueries({
    queries: [
      {
        queryKey: ["auth-user-id"],
        queryFn: () => authCommands.getFromStore("auth-user-id"),
      },
      {
        queryKey: ["onboarding-session-id"],
        queryFn: () => dbCommands.onboardingSessionId(),
      },
    ],
  });

  if (userId.status === "pending" || onboardingSessionId.status === "pending") {
    return null;
  }

  if (userId.status === "error" || onboardingSessionId.status === "error") {
    console.error(userId.error, onboardingSessionId.error);
    return null;
  }

  if (!userId.data || !onboardingSessionId.data) {
    return null;
  }

  return (
    <HyprContext.Provider value={{ userId: userId.data, onboardingSessionId: onboardingSessionId.data }}>
      {children}
    </HyprContext.Provider>
  );
}

export function useHypr() {
  const context = useContext(HyprContext);
  if (!context) {
    throw new Error("useHypr must be used within an AuthProvider");
  }
  return context;
}
