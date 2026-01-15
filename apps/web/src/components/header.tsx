import Link from "next/link";
import { getCurrentUser } from "@/app/(auth)/_utils/auth";
import LogoutButton from "@/app/(auth)/_components/logout-button";

async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold text-black dark:text-zinc-50"
        >
          말만해
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/daily/questions"
            className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            문제 목록
          </Link>
          <Link
            href="/mypage"
            className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            마이페이지
          </Link>
          {user ? (
            <>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                {user.nickname || "유저"}
              </span>
              <LogoutButton />
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

export default Header;
