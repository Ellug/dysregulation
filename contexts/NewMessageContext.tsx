"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface NewMessageContextType {
  hasNewMessage: boolean;
  setHasNewMessage: (val: boolean) => void;
}

const NewMessageContext = createContext<NewMessageContextType | undefined>(undefined);

export const NewMessageProvider = ({ children }: { children: ReactNode }) => {
  const [hasNewMessage, setHasNewMessage] = useState(false);

  return (
    <NewMessageContext.Provider value={{ hasNewMessage, setHasNewMessage }}>
      {children}
    </NewMessageContext.Provider>
  );
};

export const useNewMessage = () => {
  const context = useContext(NewMessageContext);
  if (!context) throw new Error("useNewMessage must be used within a NewMessageProvider");
  return context;
};