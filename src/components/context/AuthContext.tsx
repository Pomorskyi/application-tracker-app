"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AuthContextType = {
  isLogged: boolean;
  login: (token: string) => void;
  logout: () => void;
  token?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    async function validateToken(token: string) {
      try {
        const res = await fetch("/api/validate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.valid) {
          setToken(token);
        } else {
          localStorage.removeItem("token");
          router.push("/");
        }
      } catch (error) {
        console.error("Token validation failed", error);
        localStorage.removeItem("token");
        router.push("/");
      }
    }

    if (storedToken) {
      validateToken(storedToken);
    } else {
      router.push("/");
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    console.log("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(undefined);
  };

  const isLogged = !!token;

  return (
    <AuthContext.Provider value={{ isLogged, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
