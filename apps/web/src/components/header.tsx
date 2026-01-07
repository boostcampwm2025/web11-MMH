'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch {
      // 에러 발생 시 무시 (로그아웃 실패해도 홈으로 이동)
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-black dark:text-zinc-50">
          말만해
        </Link>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="text-sm text-zinc-500">로딩 중...</div>
          ) : user ? (
            <>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                {user.nickname || '유저'}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export { Header };

