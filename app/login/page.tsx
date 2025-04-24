"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        if (password !== confirm) {
          setError("비밀번호가 일치하지 않습니다.");
          return;
        }
        await signupWithEmail(email, password);
      }
      router.push("/sheet");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("알 수 없는 오류가 발생했습니다.");
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      router.push("/sheet");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("알 수 없는 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-950 px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-8">
        <h1 className="text-center text-3xl font-bold text-white mb-6">
          {isLogin ? "로그인" : "회원가입"}
        </h1>

        <div className="flex justify-center gap-3 mb-6">
          <button
            className={`text-sm px-5 py-2 rounded-full font-medium transition-all ${
              isLogin
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow"
                : "bg-zinc-800 text-zinc-400"
            }`}
            onClick={() => setIsLogin(true)}
          >
            로그인
          </button>
          <button
            className={`text-sm px-5 py-2 rounded-full font-medium transition-all ${
              !isLogin
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow"
                : "bg-zinc-800 text-zinc-400"
            }`}
            onClick={() => setIsLogin(false)}
          >
            회원가입
          </button>
        </div>

        <div className="relative w-full overflow-hidden h-auto">
          <div
            className="flex w-[200%] transition-transform duration-500 ease-in-out"
            style={{
              transform: isLogin ? "translateX(0%)" : "translateX(-50%)",
            }}
          >
            {/* Login Form */}
            <form className="w-full space-y-4 pr-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="이메일"
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
              >
                로그인
              </button>
              <div className="flex justify-center mt-2">
                <button
                  type="button"
                  onClick={handleGoogle}
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-600 bg-white hover:scale-105 transition overflow-hidden"
                >
                  <img
                    src="/google_icon.webp"
                    alt="Google"
                    className="h-6 w-6"
                  />
                </button>
              </div>
            </form>

            {/* Signup Form */}
            <form className="w-full space-y-4 pl-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="이메일"
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="비밀번호 확인"
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
              >
                회원가입
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
