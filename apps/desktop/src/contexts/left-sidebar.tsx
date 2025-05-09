import { createContext, useCallback, useContext, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

interface LeftSidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  togglePanel: () => void;
}

const LeftSidebarContext = createContext<LeftSidebarContextType | null>(null);

export function LeftSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const togglePanel = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  useHotkeys(
    "mod+l",
    (event) => {
      event.preventDefault();
      togglePanel();
    },
    {
      enableOnFormTags: true,
      enableOnContentEditable: true,
    },
  );

  return (
    <LeftSidebarContext.Provider value={{ isExpanded, setIsExpanded, togglePanel }}>
      {children}
    </LeftSidebarContext.Provider>
  );
}

export function useLeftSidebar() {
  const context = useContext(LeftSidebarContext);
  if (!context) {
    throw new Error("useLeftSidebar must be used within LeftSidebarProvider");
  }
  return context;
}
