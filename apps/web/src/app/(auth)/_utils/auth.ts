"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.API_URL || "http://localhost:8000";

export interface User {
  id: number;
  nickname: string | null;
  password: string | null;
  totalPoint: number | null;
  totalScore: number | null;
  createdAt: string;
}

// Nest.js API와 통신하는 헬퍼 함수
async function fetchWithCookies(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
    credentials: "include",
  });
}

// 쿠키 속성 파싱
function parseCookieAttributes(parts: string[]): {
  httpOnly: boolean;
  maxAge: number;
  secure: boolean;
} {
  const attributes: { [key: string]: string | number | boolean } = {};

  for (let i = 1; i < parts.length; i++) {
    const attr = parts[i].trim();
    const [attrName, attrValue] = attr.split("=").map((s) => s.trim());

    if (attrName.toLowerCase() === "max-age" && attrValue) {
      attributes.maxAge = parseInt(attrValue, 10);
    } else if (attrName.toLowerCase() === "httponly") {
      attributes.httpOnly = true;
    } else if (attrName.toLowerCase() === "secure") {
      attributes.secure = true;
    }
  }

  return {
    httpOnly: (attributes.httpOnly as boolean) ?? false,
    maxAge: (attributes.maxAge as number) ?? 60 * 60 * 24 * 7, // 기본값 7일
    secure: (attributes.secure as boolean) ?? false,
  };
}

// set-cookie 헤더에서 쿠키를 Next.js 쿠키 스토어에 저장
async function setCookiesFromHeader(setCookieHeader: string): Promise<void> {
  const cookieStore = await cookies();
  const cookieStrings = setCookieHeader.split(/,(?=\s*[^;]+=)/);

  for (const cookieString of cookieStrings) {
    const parts = cookieString.split(";");
    const [nameValue] = parts;
    const [name, value] = nameValue.split("=").map((s) => s.trim());

    if (name && value) {
      const attributes = parseCookieAttributes(parts);
      cookieStore.set(name, value, attributes);
    }
  }
}

// 현재 사용자 정보 가져오기
async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetchWithCookies(`${API_BASE_URL}/api/users/me`);

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

// 테스트 유저 목록 가져오기
async function getTestUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/test-users`);

    if (!response.ok) {
      throw new Error("테스트 유저 목록을 가져오는데 실패했습니다.");
    }

    return response.json();
  } catch {
    return [];
  }
}

// 로그인
async function login(nickname: string, password?: string) {
  const finalPassword = password ?? "test123";

  try {
    const response = await fetchWithCookies(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname, password: finalPassword }),
    });

    if (!response.ok) {
      throw new Error("로그인에 실패했습니다.");
    }

    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      await setCookiesFromHeader(setCookieHeader);
    }
  } catch (error) {
    throw error;
  }
}

// 로그아웃
async function logout() {
  try {
    const response = await fetchWithCookies(
      `${API_BASE_URL}/api/users/logout`,
      {
        method: "POST",
      },
    );

    // 쿠키 삭제
    const cookieStore = await cookies();
    cookieStore.delete("userId");

    if (!response.ok) {
      throw new Error("로그아웃에 실패했습니다.");
    }

    redirect("/");
  } catch (error) {
    throw error;
  }
}

export { getCurrentUser, getTestUsers, login, logout };
