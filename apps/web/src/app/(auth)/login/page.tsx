import { redirect } from "next/navigation";
import { getCurrentUser, getTestUsers, login } from "../_utils/auth";
import LoginForm from "../_components/login-form";

async function LoginPage() {
  const user = await getCurrentUser();

  // 이미 로그인되어 있으면 홈으로 리다이렉트
  if (user) {
    redirect("/");
  }

  const testUsers = await getTestUsers();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
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

          <LoginForm testUsers={testUsers} loginAction={login} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
