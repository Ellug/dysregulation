"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false); // 사용자 판별 완료 여부

  useEffect(() => {
    const publicPaths = ["/", "/login"];
    const isPublic = publicPaths.includes(pathname);

    // auth 판단이 아직 안 된 상태에서는 아무 것도 하지 않음
    if (user === null && !isPublic) {
      router.push("/login");
    }

    if (user !== null && isPublic) {
      router.push("/sheet");
    }

    setIsReady(true);
  }, [user, pathname, router]);

  if (!isReady) return null; // auth 판단 전에는 아무 것도 렌더링하지 않음

  return <>{children}</>;
}