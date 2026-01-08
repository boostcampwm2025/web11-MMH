"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getTestUsers, User } from "@/lib/api";
import { Header } from "@/components/header";

function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [testUsers, setTestUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 이미 로그인되어 있으면 홈으로 리다이렉트
    if (user) {
      router.push("/");
      return;
    }

    // 테스트 유저 목록 가져오기
    getTestUsers()
      .then((users) => {
        setTestUsers(users);
      })
      .catch(() => {
        // 에러 발생 시 빈 배열 유지
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, router]);

  const handleLogin = async (nickname: string) => {
    try {
      await login(nickname);
      router.push("/");
    } catch {
      alert("로그인에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
              테스트 로그인
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              개발/테스트 전용 로그인 페이지입니다.
            </p>
          </div>

          <div className="space-y-2">
            {testUsers.map((testUser) => (
              <button
                key={testUser.id}
                onClick={() => handleLogin(testUser.nickname ?? "")}
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <div className="font-medium text-black dark:text-zinc-50">
                  {testUser.nickname || `유저 #${testUser.id}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
