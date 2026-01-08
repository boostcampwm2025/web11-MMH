const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface User {
  id: number;
  nickname: string | null;
  password: string | null;
  totalPoint: number | null;
  totalScore: number | null;
  createdAt: string;
}

export async function getTestUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/api/users/test-users`);
  if (!response.ok) {
    throw new Error("테스트 유저 목록을 가져오는데 실패했습니다.");
  }
  return response.json();
}

export async function login(
  nickname: string,
  password: string,
): Promise<{ user: { id: number; nickname: string | null } }> {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ nickname, password }),
  });

  if (!response.ok) {
    throw new Error("로그인에 실패했습니다.");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("로그아웃에 실패했습니다.");
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
