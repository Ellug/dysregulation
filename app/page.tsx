"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/lib/firebase";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStart = () => {
    if (user) {
      router.push("/sheet");
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen px-4 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
          dysregulation
        </h1>
        <p className="text-base sm:text-lg text-zinc-400">
          실시간 채팅 기반의 시트 협업 플랫폼
        </p>

        {!loading && (
          <button
            onClick={handleStart}
            className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition font-semibold shadow-lg"
          >
            시작하기
          </button>
        )}
      </div>
    </main>
  );
}