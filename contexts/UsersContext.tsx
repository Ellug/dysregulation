"use client";

import { createContext, useContext, useEffect, useState, ReactNode, } from "react";
import { collection, onSnapshot, DocumentData, } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserInfo {
  uid: string;
  name: string;
  picture?: string;
}

interface UsersContextType {
  usersMap: Record<string, UserInfo>;
  getUserName: (uid: string) => string;
  getUserPicture: (uid: string) => string | undefined;
}

const UsersContext = createContext<UsersContextType>({
  usersMap: {},
  getUserName: () => "알 수 없음",
  getUserPicture: () => undefined,
});

export function UsersProvider({ children }: { children: ReactNode }) {
  const [usersMap, setUsersMap] = useState<Record<string, UserInfo>>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsersMap((prev) => {
        const updated = { ...prev };
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data() as DocumentData;
          const uid = change.doc.id;

          if (change.type === "added" || change.type === "modified") {
            updated[uid] = {
              uid,
              name: data.name || "이름 없음",
              picture: data.picture || "",
            };
          }

          if (change.type === "removed") {
            delete updated[uid];
          }
        });
        return updated;
      });
    });

    return () => unsubscribe();
  }, []);

  const getUserName = (uid: string) => usersMap[uid]?.name || "알 수 없음";
  const getUserPicture = (uid: string) => usersMap[uid]?.picture;

  return (
    <UsersContext.Provider value={{ usersMap, getUserName, getUserPicture }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  return useContext(UsersContext);
}
