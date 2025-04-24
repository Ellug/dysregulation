"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [usersMap, setUsersMap] = useState<Record<string, UserInfo>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const map: Record<string, UserInfo> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        map[doc.id] = {
          uid: doc.id,
          name: data.name || "이름 없음",
          picture: data.picture || "",
        };
      });

      setUsersMap(map);
    };

    fetchUsers();
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
