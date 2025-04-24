"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export default function MyPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [name, setName] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      const data = snap.data();
      if (data) {
        setName(data.name || "");
        setPictureUrl(data.picture || "");
      }
    };
    fetchUser();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    let downloadURL = pictureUrl;

    if (file) {
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, file);
      downloadURL = await getDownloadURL(storageRef);
    }

    await updateDoc(doc(db, "users", user.uid), {
      name,
      picture: downloadURL,
    });

    setFile(null);
    setPreviewUrl(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">내 정보 수정</h1>
          <button
            onClick={() => router.back()}
            className="text-sm text-zinc-400 hover:text-zinc-100 transition"
          >
            ← 뒤로가기
          </button>
        </div>

        {/* 이름 입력 */}
        <div>
          <label className="block text-sm mb-2 text-zinc-400">이름</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 프로필 이미지 업로드 */}
        <div>
          <label className="block text-sm mb-2 text-zinc-400">프로필 사진</label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-700 border border-zinc-600 flex items-center justify-center">
              {previewUrl || pictureUrl ? (
                <img
                  src={previewUrl || pictureUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-zinc-400">없음</span>
              )}
            </div>

            <label className="cursor-pointer bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition">
              사진 선택
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 저장 & 로그아웃 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-sm transition"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="w-full bg-zinc-700 hover:bg-red-600 text-white font-semibold py-2 rounded-md text-sm transition"
          >
            로그아웃
          </button>
        </div>

        {/* 성공 메시지 */}
        {success && (
          <p className="text-green-400 text-sm">저장이 완료되었습니다.</p>
        )}
      </div>
    </main>
  );
}