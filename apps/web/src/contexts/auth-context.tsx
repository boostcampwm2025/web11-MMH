"use client";

import React from "react";
import {
  User,
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
} from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (nickname: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 페이지 로드 시 현재 유저 확인
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (nickname: string, password?: string) => {
    // 테스트/내부용: 비밀번호 미입력 시 기본값 사용
    const finalPassword = password ?? "test123";
    const result = await apiLogin(nickname, finalPassword);
    // 로그인 후 전체 유저 정보를 다시 조회하여 상태 업데이트
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 내에서 사용되어야 합니다");
  }
  return context;
}

export { AuthProvider, useAuth };
