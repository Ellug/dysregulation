"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import FakeSheet from "@/components/FakeSheet";
import MobileChat from "@/components/MobileChat";

export default function SheetPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div>
      {isMobile ? <MobileChat /> : <FakeSheet />}
    </div>
  );
}